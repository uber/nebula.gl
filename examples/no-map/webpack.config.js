// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CONFIG = {
  mode: 'development',

  devtool: 'source-map',

  entry: {
    app: resolve('./app.js'),
  },

  module: {
    rules: [
      {
        // Compile ES2015 using babel
        test: /\.js$/,
        include: [resolve('.'), resolve('../deck'), resolve('../../modules')],
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
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
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
