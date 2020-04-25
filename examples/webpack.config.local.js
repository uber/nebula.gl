// This file contains webpack configuration settings that allow
// examples to be built against the nebula.gl source code in this repo instead
// of building against their installed version of nebula.gl.
//
// This enables using the examples to debug the main nebula.gl library source
// without publishing or npm linking, with conveniences such hot reloading etc.

// avoid destructuring for older Node version support
// test
const resolve = require('path').resolve;
const webpack = require('webpack');

const LIB_DIR = resolve(__dirname, '..');
const MAIN_SRC_DIR = resolve(LIB_DIR, './modules/main/src/');
const EDIT_MODES_SRC_DIR = resolve(LIB_DIR, './modules/edit-modes/src/');
const LAYERS_SRC_DIR = resolve(LIB_DIR, './modules/layers/src/');
const OVERLAYS_SRC_DIR = resolve(LIB_DIR, './modules/overlays/src/');
const EDITOR_SRC_DIR = resolve(LIB_DIR, './modules/editor/src/');
const REACT_EDITOR_LITE_SRC_DIR = resolve(LIB_DIR, './modules/react-map-gl-draw/src');

// const babelConfig = require('../babel.config');

// Support for hot reloading changes to the nebula.gl library:
function makeLocalDevConfig(EXAMPLE_DIR = LIB_DIR) {
  return {
    // suppress warnings about bundle size
    devServer: {
      stats: {
        warnings: false,
      },
    },

    devtool: 'source-map',

    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      alias: {
        'nebula.gl/dist': MAIN_SRC_DIR,
        'nebula.gl': MAIN_SRC_DIR,

        '@nebula.gl/edit-modes/dist': EDIT_MODES_SRC_DIR,
        '@nebula.gl/edit-modes': EDIT_MODES_SRC_DIR,

        '@nebula.gl/layers/dist': LAYERS_SRC_DIR,
        '@nebula.gl/layers': LAYERS_SRC_DIR,

        '@nebula.gl/overlays/dist': OVERLAYS_SRC_DIR,
        '@nebula.gl/overlays': OVERLAYS_SRC_DIR,

        '@nebula.gl/editor/dist': EDITOR_SRC_DIR,
        '@nebula.gl/editor': EDITOR_SRC_DIR,

        'react-map-gl-draw/dist': REACT_EDITOR_LITE_SRC_DIR,
        'react-map-gl-draw': REACT_EDITOR_LITE_SRC_DIR,

        'react-map-gl': resolve(LIB_DIR, './node_modules/react-map-gl'),

        '@deck.gl/core': resolve(LIB_DIR, './node_modules/@deck.gl/core'),
        '@deck.gl/layers': resolve(LIB_DIR, './node_modules/@deck.gl/layers'),

        // Use luma.gl specified by root package.json
        'luma.gl': resolve(LIB_DIR, './node_modules/luma.gl'),
        // Important: ensure shared dependencies come from the main node_modules dir
        // Versions will be controlled by the deck.gl top level package.json
        'math.gl': resolve(LIB_DIR, './node_modules/math.gl'),
        seer: resolve(LIB_DIR, './node_modules/seer'),
        react: resolve(LIB_DIR, './node_modules/react'),
      },
    },
    module: {
      rules: [
        {
          // Unfortunately, webpack doesn't import library sourcemaps on its own...
          test: /\.js$|\.ts$|\.tsx$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    // Optional: Enables reading mapbox token from environment variable
    plugins: [new webpack.EnvironmentPlugin(['MapboxAccessToken'])],
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
    rules: (config.module.rules || []).concat(LOCAL_DEV_CONFIG.module.rules),
  });
  return config;
}

module.exports = (config, exampleDir) => (env) => {
  // npm run start-local now transpiles the lib
  if (env && env.local) {
    config = addLocalDevSettings(config, exampleDir);
  }

  // npm run start-es6 does not transpile the lib
  if (env && env.es6) {
    config = addLocalDevSettings(config, exampleDir);
  }

  return config;
};
