import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import GenerateBankAccount from "../apps/bankaccount/bankaccount"

const SecondPage = () => (
  <Layout>
    <SEO title="Page two" />
    <div className="columns">
      <div className="column">
        <p>
          Here are randomly generated bank account numbers. The Dutch bank
          account number (NL) passes the 11-test and has the bank code of an
          existing bank. For Belgium, the bank code is a random number and may
          or may not match an existing bank. All generated bank accounts should
          pass most tests. If a invalid bank account number was generated,
          please copy it and log{" "}
          <a href="https://github.com/TomDeS/tosu-react/issues">an issue</a>.
        </p>
      </div>
      <div className="column">
        <p>Generated bank account numbers:</p>
        <ul className="list-none">
          <li>
            BE: <GenerateBankAccount countryCode="BE" />
          </li>
          <li>
            NL: <GenerateBankAccount countryCode="NL" />
          </li>
        </ul>
      </div>
    </div>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default SecondPage
