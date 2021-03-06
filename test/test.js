'use strict';
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
  it('Should return the expected value from appendCss', function(done) {
    var mockWindow = new mocker.Window().window;
    var randomString1 = 'teststring' + Math.random() * 1000;
    var test = app.appendCss(randomString1, mockWindow);
    test.nodeName.toLowerCase().should.equal('style');
    test.childNodes.length.should.equal(1);
    test.firstChild.nodeValue.should.equal(randomString1);
    done();
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
    mockWindow.location.href.should.equal('http://browsehappy.com/');
    ls.should.equal(false);
    alerted.should.equal(true);
    // Check that the twitter for android client is allowed.
    delete mockWindow.location.href;
    mockWindow.navigator = {
      userAgent: 'Mozilla/5.0 (Linux bla bla) Mobile Safari/537.36 TwitterAndroid'
    };
    alerted = false;
    ls = true;
    ls = app.getLsOrKickOut(mockWindow);
    // We should not get localStorage.
    ls.should.equal(false);
    // ...but we should also not complain about it.
    alerted.should.equal(false);
    // ...and a new location should not get set.
    should(mockWindow.location.href).equal(undefined);
  });

  it('Should do the expected on init', function() {
    var mockWindow = new mocker.Window().window;
    var r = mockWindow.document.createElement('div');
    r.id = 'main-wrapper';
    mockWindow.document.getElementsByTagName('body')[0].appendChild(r);
    app.init(mockWindow);
  });

  it('Should increase coverage with a few random tests', function() {
    // @todo.
  });
});

describe('disqus.js', function() {
  var disqus = require('../js/src/disqus');
  it('Should expose the expected type of value', function() {
    disqus.should.be.instanceOf(Function);
  });
  it('Should do as expected to the window', function() {
    var mockWindow = new mocker.Window().window;
    var de = mockWindow.document.createElement('div');
    try {
      Object.defineProperty(de, 'offsetTop', {
        value: 90
      })
    }
    catch (e) {
    }
    de.id = 'disqus_thread';
    mockWindow.document.getElementsByTagName('body')[0].appendChild(de);
    mockWindow.disqus_shortname = 'testtest' + Math.random() * 1000;
    mockWindow.m = {
      route: function() {
        return mockWindow.location.href;
      }
    };
    disqus(mockWindow);
    mockWindow.scrollY = 1000;
    mockWindow.onscroll();

    var elNo = 0;
    if (typeof(window) != 'undefined') {
      elNo = 1;
    }
    var el = mockWindow.document.getElementsByTagName('script')[elNo];
    var m = require('mithril');
    var p = m.route();
    if (!p) {
      p = mockWindow.location.pathname;
    }
    var expectedProtocol = mockWindow.location.protocol;
    if (mockWindow.location.protocol === 'about:') {
      expectedProtocol = '';
    }
    el.src.should.equal(expectedProtocol + '//' + mockWindow.disqus_shortname + '.disqus.com/embed.js?url=' + p);
    var hasReset = false;
    mockWindow.DISQUS = {
      page: {},
      reset: function(c) {
        hasReset = true;
        // Just run that reset config function for coverage.
        if (c.config.bind) {
          c.config.bind(mockWindow.DISQUS)();
        }
      }
    };
    disqus(mockWindow);
    mockWindow.onscroll();
    hasReset.should.equal(true);
  });
});

describe('gist.js', function() {
  var g = require('../js/src/gist');
  it('Should expose expected type of value', function() {
    g.should.be.instanceOf(Function);
  });
  it('Should manipulate the window as expected', function() {
    var mockWindow = new mocker.Window().window;
    var el = mockWindow.document.createElement('gist');
    el.innerHTML = 123;
    mockWindow.document.getElementsByTagName('body')[0].appendChild(el);
    g(mockWindow);
    // Try to find out the callback name.
    var cb;
    for (var prop in mockWindow) {
      if (prop.indexOf('gist_callback') === 0) {
        cb = prop;
      }
    }

    var ge = mockWindow.document.getElementsByTagName('gist')[0];
    var s = mockWindow.document.getElementsByTagName('script');
    var se;
    for (var i = 0, len = s.length; i < len; i++) {
      var n = s[i];
      if (n.src.indexOf('github')) {
        se = n;
      }
    }
    var gid = 123;
    ge.nodeName.toLowerCase().should.equal('gist');
    se.nodeName.toLowerCase().should.equal('script');
    se.src.should.equal('https://gist.github.com/' + gid + '.json?callback=' + cb);
    // Try to call the callback
    var style = 'test' + Math.random() * 1000;
    var div = 'test' + Math.random() * 1000;
    var preLength = mockWindow.document.body.childNodes.length;
    mockWindow[cb]({stylesheet: style, div: div});
    mockWindow.document.body.childNodes.length.should.equal(preLength - 1);
    ge.innerHTML.should.equal('<link href="' + style + '" rel="stylesheet">' + div);
  });
});
