// This file contains webpack configuration settings that allow
// examples to be built against the nebula.gl source code in this repo instead
// of building against their installed version of nebula.gl.
//
// This enables using the examples to debug the main nebula.gl library source
// without publishing or npm linking, with conveniences such hot reloading etc.

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

const LIB_DIR = resolve(__dirname, '..');
const CORE_SRC_DIR = resolve(LIB_DIR, './modules/core/src');
const LAYERS_SRC_DIR = resolve(LIB_DIR, './modules/layers/src');
const OVERLAYS_SRC_DIR = resolve(LIB_DIR, './modules/overlays/src');

// const babelConfig = require('../babel.config');

// Support for hot reloading changes to the nebula.gl library:
function makeLocalDevConfig(EXAMPLE_DIR = LIB_DIR) {
  return {
    // suppress warnings about bundle size
    devServer: {
      stats: {
        warnings: false
      }
    },

    devtool: 'source-map',

    resolve: {
      alias: {
        'nebula.gl/dist': CORE_SRC_DIR,
        'nebula.gl': CORE_SRC_DIR,

        '@nebula.gl/layers/dist': LAYERS_SRC_DIR,
        '@nebula.gl/layers': LAYERS_SRC_DIR,

        '@nebula.gl/overlays/dist': OVERLAYS_SRC_DIR,
        '@nebula.gl/overlays': OVERLAYS_SRC_DIR,

        '@deck.gl/core': resolve(LIB_DIR, './node_modules/@deck.gl/core'),
        '@deck.gl/layers': resolve(LIB_DIR, './node_modules/@deck.gl/layers'),

        // Use luma.gl specified by root package.json
        'luma.gl': resolve(LIB_DIR, './node_modules/luma.gl'),
        // Important: ensure shared dependencies come from the main node_modules dir
        // Versions will be controlled by the deck.gl top level package.json
        'math.gl': resolve(LIB_DIR, './node_modules/math.gl'),
        seer: resolve(LIB_DIR, './node_modules/seer'),
        react: resolve(LIB_DIR, './node_modules/react')
      }
    },
    module: {
      rules: [
        {
          // Unfortunately, webpack doesn't import library sourcemaps on its own...
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre'
        }
      ]
    },
    // Optional: Enables reading mapbox token from environment variable
    plugins: [new webpack.EnvironmentPlugin(['MapboxAccessToken'])]
  };
}

function addLocalDevSettings(config, exampleDir) {
  const LOCAL_DEV_CONFIG = makeLocalDevConfig(exampleDir);
  config = Object.assign({}, LOCAL_DEV_CONFIG, config);
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  Object.assign(config.resolve.alias, LOCAL_DEV_CONFIG.resolve.alias);

  config.module = config.module || {};
  Object.assign(config.module, {
    rules: (config.module.rules || []).concat(LOCAL_DEV_CONFIG.module.rules)
  });
  return config;
}

module.exports = (config, exampleDir) => env => {
  // npm run start-local now transpiles the lib
  if (env && env.local) {
    config = addLocalDevSettings(config, exampleDir);
  }

  // npm run start-es6 does not transpile the lib
  if (env && env.es6) {
    config = addLocalDevSettings(config, exampleDir);
  }

  // console.warn(JSON.stringify(config, null, 2));

  return config;
};
