const {getGatsbyConfig} = require('ocular-gatsby/api');
const config = require('./ocular-config');

const gatsbyConfig = getGatsbyConfig(config);
gatsbyConfig.plugins.push('gatsby-plugin-flow');


const remark = gatsbyConfig.plugins.find(p => p.resolve === 'gatsby-transformer-remark');
// If you are using gatsby-remark-responsive-iframe, it must appear after gatsby-remark-embedded-codesandbox
// plugin in your configuration or the iframe will not be transformed.

remark.options.plugins.unshift({
  resolve: 'gatsby-remark-embedded-codesandbox',
  options: {
    directory: `${__dirname}/../examples/website`,
    protocol: 'embedded-codesandbox://'
  }
});

module.exports = gatsbyConfig;
