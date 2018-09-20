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
const SRC_DIR = resolve(LIB_DIR, './modules/core/src');

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
        // For importing modules that are not exported at root
        'nebula.gl/dist': SRC_DIR,
        // Imports the nebula.gl library from the src directory in this repo
        'nebula.gl': SRC_DIR,

        'deck.gl': resolve(LIB_DIR, './node_modules/deck.gl'),
        '@deck.gl/experimental-layers': resolve(
          LIB_DIR,
          './node_modules/@deck.gl/experimental-layers'
        ),

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

const BUBLE_CONFIG = {
  module: {
    rules: [
      {
        // Compile ES2015 using babel
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve(SRC_DIR)],
        exclude: [/node_modules/]
      }
    ]
  }
};

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

function addBubleSettings(config) {
  config.module = config.module || {};
  Object.assign(config.module, {
    rules: (config.module.rules || []).concat(BUBLE_CONFIG.module.rules)
  });
  return config;
}

module.exports = (config, exampleDir) => env => {
  // npm run start-local now transpiles the lib
  if (env && env.local) {
    config = addLocalDevSettings(config, exampleDir);
    config = addBubleSettings(config);
    // console.warn(JSON.stringify(config, null, 2));
  }

  // npm run start-es6 does not transpile the lib
  if (env && env.es6) {
    config = addLocalDevSettings(config, exampleDir);
    // console.warn(JSON.stringify(config, null, 2));
  }

  return config;
};
