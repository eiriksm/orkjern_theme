var fs = require('fs');

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    logLevel: config.LOG_INFO,
    captureTimeout: 120000,
    browsers: [
      'Chrome'
    ],
    reporters: [
      'dots'
    ],

    files: [
      'build/test.js'
    ]
  });
};
