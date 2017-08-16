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


const webpack                  = require('webpack');
const path                     = require('path');

const CopyWebpackPlugin        = require('copy-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

const helpers                  = require('./helpers');

module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [helpers.root('src'),'node_modules']
  },
  module: {
    rules: [
      /**
       * Source map loader support for *.js files
       * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
       *
       * See: https://github.com/webpack/source-map-loader
       */
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          // these packages have problems with their sourcemaps
          helpers.root('node_modules/rxjs'),
          helpers.root('node_modules/@angular')
        ]
      },

      {
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            query: {
              // use inline sourcemaps for "karma-remap-coverage" reporter
              sourceMap: false,
              inlineSourceMap: true,
              compilerOptions: {

                // Remove TypeScript helpers to be injected
                // below by DefinePlugin
                removeComments: true

              }
            },
          },
          'angular2-template-loader'
        ],
        exclude: [/\.e2e\.ts$/]
      },
      {
        test: /\.css$/,
        loader: ['to-string-loader', 'css-loader'],
        exclude: [helpers.root('src/index.html'), helpers.root('src/admin.html')]
      },
      {
        test: /\.scss$/,
        loaders: ['raw-loader', 'sass-loader'],
        exclude: [helpers.root('src/index.html'), helpers.root('src/admin.html')]
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [helpers.root('src/index.html'), helpers.root('src/admin.html')]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)/,
        loader: 'null-loader'
      },
      {
        enforce: 'post',
        test: /\.(js|ts)$/,
        loader: 'istanbul-instrumenter-loader',
        query: {
          esModules: true
        },
        include: helpers.root('src'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
      },
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './assets',
        to: './assets'
      },
      {
        from: 'node_modules/font-awesome/css/font-awesome.min.css',
        to: 'assets/font-awesome/css/font-awesome.min.css',
      },
      {
        from: 'node_modules/font-awesome/fonts',
        to: 'assets/font-awesome/fonts'
      }
    ]),
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('./src') // location of your src
    )
  ]
};