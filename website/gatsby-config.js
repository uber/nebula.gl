const {getGatsbyConfig} = require('ocular-gatsby/api');
const config = require('./ocular-config');

const gatsbyConfig = getGatsbyConfig(config);
gatsbyConfig.plugins.push('gatsby-plugin-flow');

module.exports = gatsbyConfig;
