// NOTE: To use this example standalone (e.g. outside of repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

// const BABEL_CONFIG = {
//   presets: ['@babel/env', '@babel/react'],
//   plugins: ['@babel/proposal-class-properties']
// };

const config = {
  mode: 'development',

  entry: {
    app: resolve('./src/app.js')
  },

  devtool: 'source-map',

  output: {
    library: 'App'
  },

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
            presets: [
              require('@babel/preset-env'),
              require('@babel/preset-react'),
              require('@babel/preset-flow')
            ],
            plugins: [
              require('@babel/plugin-proposal-class-properties'),
              require('@babel/plugin-proposal-export-default-from')
            ]
          }
        }
      },
      {
        // webpackl 4 fix for broken turf module: https://github.com/uber/nebula.gl/issues/64
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }
    ]
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [new webpack.EnvironmentPlugin(['MapboxAccessToken'])]
};

// Enables bundling against src in this repo rather than the installed version
module.exports = env =>
  env && env.local ? require('../webpack.config.local')(config)(env) : config;
