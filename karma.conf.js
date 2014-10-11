var fs = require('fs');

module.exports = function(config) {
  // Use ENV vars on Travis and sauce.json locally to get credentials
  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('sauce.json')) {
      console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
      process.exit(1);
    } else {
      process.env.SAUCE_USERNAME = require('./sauce').username;
      process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
    }
  }
  // Browsers to run on Sauce Labs
  var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    'SL_Firefox': {
      base: 'SauceLabs',
      browserName: 'firefox'
    },
    SL_Safari: {
      base: 'SauceLabs',
      browserName: 'safari'
    },
    SL_Iphone: {
      base: 'SauceLabs',
      browserName: 'iphone'
    },
    SL_Ipad: {
      base: 'SauceLabs',
      browserName: 'ipad'
    },
    SL_Android: {
      base: 'SauceLabs',
      browserName: 'android'
    },
    SL_Android_p: {
      base: 'SauceLabs',
      browserName: 'android_phone'
    },
    'SL_IE11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11'
    },
    'SL_IE10': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10'
    },
    'SL_IE9': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '9'
    }
  };

  config.set({
    frameworks: ['mocha'],
    logLevel: config.LOG_INFO,
    captureTimeout: 120000,
    sauceLabs: {
      'testName': 'Orkjern theme browser test',
      'build': 'theme-' + Date.now(),
      'public': 'public'
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    //browsers: [
    //  'Chrome'
    //],
    reporters: [
      'saucelabs',
      'dots'
    ],

    files: [
      'build/test.js'
    ]
  });
};
