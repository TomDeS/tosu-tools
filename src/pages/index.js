import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Race from "../apps/race/race"
import Crypto from "../apps/crypto/crypto"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Crypto />

    <Race />

    <p>
      <Link to="/page-2/">Go to page 2</Link> <br />
      <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
    </p>
  </Layout>
)

export default IndexPage
