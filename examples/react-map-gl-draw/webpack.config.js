// NOTE: To use this example standalone (e.g. outside of repo)
// delete the local development overrides at the bottom of this file

// hack for node 17+
const crypto = require('crypto');
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = (algorithm) =>
  crypto_orig_createHash(algorithm == 'md4' ? 'sha256' : algorithm);

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

const config = {
  mode: 'development',

  entry: {
    app: resolve('./app.js'),
  },

  devServer: {
    contentBase: [resolve(__dirname), resolve(__dirname, './static')],
  },

  output: {
    library: 'App',
    path: resolve(__dirname, './dist'),
    filename: 'app.js',
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        // Compile ES2015 using babel
        test: /\.js$/,
        include: [resolve('.'), resolve('../../modules')],
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [require('@babel/preset-env'), require('@babel/preset-react')],
            plugins: [
              require('@babel/plugin-proposal-class-properties'),
              require('@babel/plugin-proposal-export-default-from'),
            ],
          },
        },
      },
      {
        // webpackl 4 fix for broken turf module: https://github.com/uber/nebula.gl/issues/64
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|gif|jpe?g|png)$/,
        loader: 'url-loader',
      },
    ],
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [new webpack.EnvironmentPlugin(['MapboxAccessToken', 'MapStyle'])],
};

// Enables bundling against src in this repo rather than the installed version
module.exports = (env) =>
  env && env.local ? require('../webpack.config.local')(config)(env) : config;
