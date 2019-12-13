const ocularConfig = require('./ocular-config');

// If you are using gatsby-remark-responsive-iframe, it must appear after gatsby-remark-embedded-codesandbox
// plugin in your configuration or the iframe will not be transformed.

const embeddedCodesandbox = {
  resolve: 'gatsby-remark-embedded-codesandbox',
  options: {
    directory: `${__dirname}/../examples/codesandbox`,
    protocol: 'embedded-codesandbox://',
    embedOptions: {
      // https://codesandbox.io/docs/embedding#embed-options
      codemirror: 1,
      fontsize: 12,
      hidenavigation: 1,
      view: 'split'
    },
    getIframe: url =>
      `<iframe src="${url}" style="width: 70vw; height: 70vh;" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`
  }
};

module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-ocular`,
      options: ocularConfig
    },
    {
      resolve: `gatsby-plugin-flow`
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [embeddedCodesandbox]
      }
    }
  ]
};
