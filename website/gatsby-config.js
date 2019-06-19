const { getGatsbyConfig } = require('ocular-gatsby/api');
const config = require('./ocular-config');

const gatsbyConfig = getGatsbyConfig(config);
gatsbyConfig.plugins.push('gatsby-plugin-flow');

const remark = gatsbyConfig.plugins.find(p => p.resolve === 'gatsby-transformer-remark');
// If you are using gatsby-remark-responsive-iframe, it must appear after gatsby-remark-embedded-codesandbox
// plugin in your configuration or the iframe will not be transformed.

remark.options.plugins.unshift({
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
});

module.exports = gatsbyConfig;
