const { setOcularConfig } = require('gatsby-theme-ocular');
const ocularConfig = require('./ocular-config');
const DEPENDENCIES = require('./package.json').dependencies;

setOcularConfig(ocularConfig);

module.exports.onCreateWebpackConfig = function onCreateWebpackConfigOverride(opts) {
  const {
    stage, // build stage: ‘develop’, ‘develop-html’, ‘build-javascript’, or ‘build-html’
    // rules, // Object (map): set of preconfigured webpack config rules
    // plugins, // Object (map): A set of preconfigured webpack config plugins
    getConfig, // Function that returns the current webpack config
    // loaders, // Object (map): set of preconfigured webpack config loaders
    actions,
  } = opts;

  console.log(`App rewriting gatsby webpack config ${stage}`); // eslint-disable-line

  const config = getConfig();
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};

  const ALIASES = ocularConfig.webpack.resolve.alias;

  // When duplicating example dependencies in website, autogenerate
  // aliases to ensure the website version is picked up
  // NOTE: module dependencies are automatically injected
  // TODO - should this be automatically done by ocular-gatsby?
  const dependencyAliases = {};
  for (const dependency in DEPENDENCIES) {
    dependencyAliases[dependency] = `${__dirname}/node_modules/${dependency}`;
  }

  Object.assign(config.resolve.alias, ALIASES, dependencyAliases);

  /*
  // Recreate it with custom exclude filter
  // Called without any arguments, `loaders.js` will return an
  // object like:
  // {
  //   options: undefined,
  //   loader: '/path/to/node_modules/gatsby/dist/utils/babel-loader.js',
  // }
  // Unless you're replacing Babel with a different transpiler, you probably
  // want this so that Gatsby will apply its required Babel
  // presets/plugins.  This will also merge in your configuration from
  // `babel.config.js`.
  const newJSRule = loaders.js();

  Object.assign(newJSRule, {
    // JS and JSX
    test: /\.jsx?$/,

    // Exclude all node_modules from transpilation, except for ocular
    exclude: modulePath =>
      /node_modules/.test(modulePath) &&
      !/node_modules\/(ocular|ocular-gatsby|gatsby-theme-ocular)/.test(modulePath)
  });

  // Omit the default rule where test === '\.jsx?$'
  const rules = [newJSRule];

  if (stage === 'build-html') {
    rules.push({
      test: /mapbox-gl/,
      use: loaders.null()
    });
  }

  const newConfig = {
    module: {
      rules
    },
    node: {
      fs: 'empty'
    }
  };
  */

  // Completely replace the webpack config for the current stage.
  // This can be dangerous and break Gatsby if certain configuration options are changed.
  // Generally only useful for cases where you need to handle config merging logic yourself,
  // in which case consider using webpack-merge.
  actions.replaceWebpackConfig(config);
};
