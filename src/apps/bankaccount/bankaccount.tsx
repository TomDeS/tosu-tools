import React from 'react'

import { bicValues } from './bicValues'
import { randomNumber } from "../../utilities/randomNumber"
import CopyButton from '../../utilities/copyButton'

const GenerateBankAccount = ({
  countryCode = 'BE',
}: {
  countryCode: string
}) => {
  let digits: number = 0
  let bic: string = getBicCode(countryCode).toString()
  // Get digits
  switch (countryCode) {
    case 'NL':
      digits = getNumbers(10, true)
      break
    case 'BE':
      let subDigits = getNumbers(7, false)
      digits = calculateModulo(bic, subDigits)
      break
    default:
      break
  }

  const checkSum: string = calculateCheckSum(countryCode, bic, digits)

  const account = `${countryCode}${checkSum}${bic}${digits}`

  return (
    <>
      <span id={account} className="select-all text-mono">
        {account}
      </span>
      <CopyButton data={account} />
    </>
  )
}

export default GenerateBankAccount

function getNumbers(count: number, elevenTest: boolean): number {
  let i: number = 0
  let j: number = 0
  let k: number = 0
  let p1: number = 0
  let p2: number = 0
  let digits: number[] = []
  let pass11: boolean = false
  const highestDigit: number = 9

  // get {count} random base 10 numbers
  for (i = 0; i < count; i++) {
    if (i === 0) {
      digits[i] = randomNumber(1, highestDigit) // first digit may not be zero
    } else {
      digits[i] = randomNumber(0, highestDigit)
    }
  }

  // If 11-test is applicable, verify generated numbers
  if (elevenTest) {
    // check if they pass the 11-test
    pass11 = perform11test(digits)

    // 11-test failed, try manipulating two digits
    // we could simply start over, but there's less chance we pass then.
    if (!pass11) {
      // take two random digits
      p1 = randomNumber(1, highestDigit)
      p2 = randomNumber(1, highestDigit)

      // make sure we didn't select twice the same digit
      while (p1 === p2) {
        p2 = randomNumber(0, highestDigit)
      }

      for (j = 0; j < count && pass11 === false; j++) {
        digits[p1] = j
        for (k = 0; k < count && pass11 === false; k++) {
          digits[p2] = k
          pass11 = perform11test(digits)
        }
      }

      // Check if length is OK
      if (digits.length !== count) {
        getNumbers(count, elevenTest)
      }

      // Re-evaluate pass11
      if (!pass11) {
        // We went through all options without success. Start over.
        getNumbers(count, elevenTest)
      }
    }
  }

  return parseInt(digits.join(''), 10)
}

function calculateModulo(bankIdentification, digits): number {
  // 1. Convert bank identification and digits to number
  const identification: number = parseInt(bankIdentification, 10)

  // 2. Combine number from identification and digits as per specs
  // Convert to string first since we want to concatenate iso cumulate
  const number: number = parseInt(
    identification.toString() + digits.toString(),
    10
  )

  // 3. Calculate modulo
  const modulo: number = number % 97

  // 4. Add result from modulo to number
  const checkSum = modulo === 97 ? '97' : modulo.toString().padStart(2, '0')

  const result: number = parseInt('' + digits + checkSum, 10)

  // 5. Return new digits with modulo at the end
  return result
}

function perform11test(nr: number[]): boolean {
  let sum: number = 0
  let j: number = 0
  let i: number = 0

  for (i = 10; i >= 1; i--) {
    sum += nr[j] * i
    j++
  }

  if (sum % 11 === 0) {
    return true
  }

  return false
}

function getBicCode(countryCode: string): string {
  let bic: string = ''

  // Loop through the data and if we have a match, take those.
  // Array source: https://www.betaalvereniging.nl/en/focus/giro-based-and-online-payments/bank-identifier-code-bic-for-sepa-transactions/
  const allBics: string[] = bicValues.reduce((codes: any, currentValue) => {
    if (currentValue['countryCode'] === countryCode.toUpperCase()) {
      codes.push(currentValue['BIC'])
    }
    return codes
  }, [])

  // Convert it to a flat list, since all values are possible candidates
  const bicList = allBics.flat()

  // If we had a match earlier, choose a random item and return it
  if (allBics.length) {
    const bic = bicList[randomNumber(0, bicList.length - 1)]
    return bic
  }
  // Fallback: if allBics is empty, generate a number based BIC
  bic = randomNumber(0, 999).toString().padStart(3, '0')

  return bic
}

function getLetterValue(letters: string): string {
  let i: number = 0
  let letterValue: string = ''

  for (i = 0; i < letters.length; i++) {
    // 'A' === 65, but we need it as 10, B=11 and so on
    letterValue += letters.charCodeAt(i) - 55
  }

  return letterValue
}

function calculateCheckSum(
  country: string,
  bankIdentification: string,
  numbers: number
): string {
  const countryValue = getLetterValue(country)
  let identification: string = ''

  if (country === 'NL') {
    identification = getLetterValue(bankIdentification)
  } else {
    identification = bankIdentification
  }

  const checkCombination = identification + numbers + countryValue + '00'

  /*
  Piece-wise calculation D mod 97 can be done in many ways. One such way is as follows:
      1. Starting from the leftmost digit of D, construct a number using the first 9 digits and call it N.
      2. Calculate N mod 97.
      3. Construct a new 9-digit N by concatenating above result (step 2) with the next 7 digits of D.
      If there are fewer than 7 digits remaining in D but at least one, then construct a new N, which
      will have less than 9 digits, from the above result (step 2) followed by the remaining digits of D
      4. Repeat steps 2–3 until all the digits of D have been processed
      The result of the final calculation in step 2 will be D mod 97 = N mod 97.
      5. Calculate 98 - final result
  */

  let accString: string = checkCombination
  let checkNr: string
  let modNr: number
  let checkSum: number
  let result: string

  checkNr = accString.substring(0, 9)
  modNr = parseInt(checkNr, 10) % 97

  accString = accString.substring(9, accString.length)

  while (accString.length > 0) {
    checkNr = '' + modNr + accString.substring(0, 7)
    modNr = parseInt(checkNr, 10) % 97
    accString = accString.substring(7, accString.length)

    if (accString.length < 7) {
      accString = accString.substring(0, accString.length)
    }
  }

  checkSum = 98 - modNr

  // If checksum <= 9; add a leading 0.
  if (checkSum <= 9) {
    result = '0' + checkSum
  } else {
    result = '' + checkSum
  }

  return result
}
