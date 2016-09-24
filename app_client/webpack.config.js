const webpack               = require('webpack');
const CommonsChunkPlugin    = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin     = require('copy-webpack-plugin');
const DefinePlugin          = require('webpack/lib/DefinePlugin');
const ProvidePlugin         = require('webpack/lib/ProvidePlugin');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.config.js');
var helpers = require('./webpack.helpers.js');

const ENV  = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const metadata = {
  baseUrl: '/',
  ENV    : ENV,
  host   : HOST,
  port   : PORT
};

module.exports = webpackMerge(commonConfig, {
  debug: true,
  devServer: {
    contentBase: 'src',
    historyApiFallback: true,
    host: metadata.host,
    port: metadata.port,
    proxy: {
      '/api/*': {
        target: 'http://localhost:8000',
        secure: false
      }
    }
  },
  devtool: 'source-map',
  output: {
    path    : './',
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: './',
  },
  plugins: [
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.ENV)}})
  ]
});
