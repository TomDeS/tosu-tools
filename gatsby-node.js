/**
 *
 * Gatsby v3 uses webpack v5. Previous versions used to include polyfills for
 * node.js core modules by default. This is no longer the case.
 * This triggered a warning for the crypto module in crypto-js.
 * Since we focus on modern browsers only, no polyfill is required.
 * See: https://stackoverflow.com/a/64802753
 *
 */

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        crypto: false,
      },
    },
  })
}
