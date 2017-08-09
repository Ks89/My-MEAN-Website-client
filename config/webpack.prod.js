/*
 * Copyright (C) 2015-2017 Stefano Cappa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const webpack                 = require('webpack');
const DefinePlugin            = require('webpack/lib/DefinePlugin');

const UglifyJsPlugin          = require('uglifyjs-webpack-plugin');
const WebpackMd5HashPlugin    = require('webpack-md5-hash');
const CompressionPlugin       = require('compression-webpack-plugin');
const webpackMerge            = require('webpack-merge');
const ExtractTextPlugin       = require('extract-text-webpack-plugin');
const OptimizeJsPlugin        = require('optimize-js-plugin');
const LoaderOptionsPlugin     = require('webpack/lib/LoaderOptionsPlugin');

const commonConfig            = require('./webpack.common.js');
const helpers                 = require('./helpers');

const ENV = process.env.NODE_ENV = 'production';
const METADATA = {env: ENV};

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',
  output: {
    path: helpers.root('dist'),
    filename: '[name].[chunkhash].js',
    sourceMapFilename: '[file].map',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: './'
  },
  module: {
    rules: [

      /*
       * Extract CSS files from .src/styles directory to external CSS file
       */
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        }),
        include: [helpers.root('src', 'styles')]
      },

      /*
       * Extract and compile SCSS files from .src/styles directory to external CSS file
       */
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader'
        }),
        include: [helpers.root('src', 'styles')]
      },

    ]
  },
  plugins: [
    new OptimizeJsPlugin({
      sourceMap: false
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true
    }),
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(METADATA.env)}}),
    new WebpackMd5HashPlugin(),
    new CompressionPlugin({regExp: /\.css$|\.html$|\.js$|\.map$/}),
    new UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8 : true
      },
      output: {
        comments: false
      },
      compress: {
        screw_ie8: true,
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: false // we need this for lazy v8
      }
    }),
    new LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        /**
         * Html loader advanced options
         *
         * See: https://github.com/webpack/html-loader#advanced-options
         */
        // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
        // htmlLoader: {
        //   minimize: true,
        //   removeAttributeQuotes: false,
        //   caseSensitive: true,
        //   customAttrSurround: [
        //     [/#/, /(?:)/],
        //     [/\*/, /(?:)/],
        //     [/\[?\(?/, /(?:)/]
        //   ],
        //   customAttrAssign: [/\)?\]?=/]
        // },
      }
    }),

  ],
  node: {
    global: true,
    crypto: 'empty',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
