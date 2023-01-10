// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// hack for node 17+
const crypto = require('crypto');
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = (algorithm) =>
  crypto_orig_createHash(algorithm == 'md4' ? 'sha256' : algorithm);

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CONFIG = {
  mode: 'development',

  devtool: 'source-map',

  entry: {
    app: resolve('./app.tsx'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  stats: 'minimal',
  module: {
    rules: [
      {
        // Compile ES2015 using babel
        test: /(\.js|\.ts|\.tsx)$/,
        include: [resolve('.'), resolve('../../modules')],
        exclude: [/node_modules/],
        include: [/@luma.gl\/core/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              require('@babel/preset-env'),
              require('@babel/preset-react'),
              require('@babel/preset-typescript'),
            ],
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
    ],
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new HtmlWebpackPlugin({ title: 'nebula.gl' }),
    new webpack.EnvironmentPlugin(['MapboxAccessToken']),
  ],
};

// This line enables bundling against src in this repo rather than installed module
module.exports = (env) => (env ? require('./../webpack.config.local')(CONFIG)(env) : CONFIG);
