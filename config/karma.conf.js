'use strict';

const webpackTestConfig = require('./webpack.test');
const os = require('os');

console.log(`Starting Karma with isCI=${!!isCI()}`);

function isCI() {
  return process.env.CI || process.env.APPVEYOR || process.env.TRAVIS;
}

function getBrowsers() {
  if (process.env.CI) {
    if (process.env.APPVEYOR) { // variable defined by APPVEYOR itself
      // only for AppVeyor
      return ['Chrome', 'Firefox' /*, 'IE'*/];
    } else if (process.env.TRAVIS) { // variable defined by TRAVIS itself
      return ['ChromeHeadless', 'Chrome', 'Firefox'];
    } else if (process.env.CIRCLECI) { // variable defined by CIRCLECI itself
      return ['ChromeHeadless', 'Chrome', 'Firefox'];
    }
  } else {
    switch(os.platform()) {
      case 'win32': // Windows
        return ['ChromeHeadless', 'Chrome', 'Firefox' /*'IE'*/];
      case 'darwin': // macOS
        return ['ChromeHeadless', 'Chrome', 'Firefox'/*, 'Safari'*/];
      default: // other (linux, freebsd, openbsd, sunos, aix)
        return ['ChromeHeadless', 'Chrome', 'Firefox'];
    }
  }
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: './config/karma-test-runner.js', watched: false },
      { pattern: './assets/**/*', watched: false, included: false, served: true, nocache: false }
    ],

    // /**
    //  * By default all assets are served at http://localhost:[PORT]/base/
    //  */
    // proxies: {
    //   "/assets/": "/base/src/assets/"
    // },

    exclude: [],
    preprocessors: {
      './config/karma-test-runner.js': ['coverage', 'webpack', 'sourcemap']
    },
    webpack: webpackTestConfig,

    webpackMiddleware: {
      stats: {
        chunks: false
      }
      // stats: 'errors-only'
    },

    reporters: ['progress', 'mocha', 'kjhtml', 'coverage', 'remap-coverage'],


    // webpackServer: {noInfo: true},

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: getBrowsers(),

    // It's ok, but I'm forcing --single-run, at the moment, so this value will be ignored
    singleRun: !!isCI(),

    coverageReporter: {
      type: 'in-memory'
    },

    remapCoverageReporter: {
      'text-summary': null,
      'json': './coverage/coverage.json',
      'html': './coverage/html',
      'lcovonly': './coverage/lcov.info'
    },
    jasmineDiffReporter: {
      multiline: true
    },

    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          ' --remote-debugging-port=9222',
        ]
      }
    },

    // For AppVeyor and TravisCI to prevent timeouts
    browserNoActivityTimeout: 60000,
    //browserDisconnectTimeout: 60000,
    //browserDisconnectTolerance: 10
  });
};
