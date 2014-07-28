var should = require('should');
var app = require('../js/src/app');
var mocker = require('./mock/mocker');

describe('Theme function exports', function() {
  it('Should expose all expected functions from app.js', function() {
    app.init.should.be.instanceOf(Function);
    app.getLsOrKickOut.should.be.instanceOf(Function);
    app.appendCss.should.be.instanceOf(Function);
  });
});

describe('app.js functions', function() {
  it('Should return the expected value from appendCss', function() {
    var mockWindow = mocker.window;
    var randomString1 = 'teststring' + Math.random() * 1000;
    var test = app.appendCss(randomString1, mockWindow);
    test.type.should.equal('head');
    test.childNodes.length.should.equal(1);
    test.childNodes[0].type.should.equal('text/css');
    test.childNodes[0].childNodes[0].text.should.equal(randomString1);
    // Just for coverage, we do this:
    mockWindow.document.createElement = function(type) {
      var el = new mocker.MockElement(type);
      el.styleSheet = {};
      return el;
    };
    var randomString2 = 'teststring' + Math.random() * 1000;
    var test2 = app.appendCss(randomString2, mockWindow);
    test2.childNodes[0].styleSheet.cssText.should.equal(randomString2);
  });

  it('Should return the expected value from getLsOrKickOut', function() {
    var randomString = 'teststring' + Math.random() * 1000;
    var alerted = false;
    var mockWindow = {
      location: {},
      localStorage: randomString,
      alert: function() {
        alerted = true;
      }
    };
    var ls = app.getLsOrKickOut(mockWindow);
    ls.should.equal(randomString);
    delete mockWindow.localStorage;
    ls = app.getLsOrKickOut(mockWindow);
    ls.should.equal('http://browsehappy.com/');
    alerted.should.equal(true);
  });

  it('Should do the expected on init', function() {
    var mockWindow = mocker.window;
    var a = app.init(mockWindow);
    // See that some values are set as expected.
    a.window.mockElements[a.window.mockElements.length - 2].id.should.equal('main-wrapper');
  });
});
