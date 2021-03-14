import React from 'react'

import SHA256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'
import ENC from 'crypto-js/enc-utf8'
import Hex from 'crypto-js/enc-hex'

import CopyButton from '../../utilities/copyButton'

interface CryptoStateProps {
  cryptoMethod: string
  inputText: string
  cryptoResult: string
}

export default class Crypto extends React.Component<any, CryptoStateProps> {
  constructor(props) {
    super(props)
    this.state = {
      cryptoMethod: 'sha256',
      inputText: '',
      cryptoResult: '',
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Checks

    this.setState({
      cryptoResult: this.cryptoMagic(
        this.state.cryptoMethod,
        this.state.inputText
      ),
    })
  }

  cryptoMagic(cryptoMethod, cryptoText) {
    try {
      switch (cryptoMethod) {
        case 'base64decode':
          const parsedWordArray = Base64.parse(cryptoText.toString())
          return parsedWordArray.toString(ENC)

        case 'base64encode':
          const wordArray = ENC.parse(cryptoText)
          return Base64.stringify(wordArray)

        case 'sha256':
          return SHA256(this.state.inputText).toString(Hex)
      }
    } catch (error) {
      console.error(error)
      return 'Something went wrong. Are you sure this is a valid input?'
    }
  }

  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <div className="controls" onChange={this.handleChange}>
            <label className="radio">
              <input type="radio" value="base64decode" name="cryptoMethod" />
              <span>Base64 decode</span>
            </label>

            <label className="radio">
              <input type="radio" value="base64encode" name="cryptoMethod" />
              <span>Base64 encode</span>
            </label>

            <label className="radio">
              <input
                type="radio"
                value="sha256"
                name="cryptoMethod"
                defaultChecked
              />
              <span>SHA-256</span>
            </label>
          </div>

          <textarea
            className="input"
            name={'inputText'}
            onChange={this.handleChange}
            id={'inputText'}
            required={true}
            autoComplete="off"
            aria-labelledby="label-inputText"
            rows={10}
          />

          <button className="button" type="submit">
            Transform
          </button>
        </form>

        {this.state.cryptoResult && (
          <p>
            Result: <br />
            <span
              id="cryptoResult"
              className="select-all text-mono"
              dangerouslySetInnerHTML={{
                __html: this.state.cryptoResult,
              }}
            ></span>
            <CopyButton data="cryptoResult" />
          </p>
        )}
      </>
    )
  }
}
