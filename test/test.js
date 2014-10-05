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
    var mockWindow = new mocker.Window().window;
    var randomString1 = 'teststring' + Math.random() * 1000;
    var test = app.appendCss(randomString1, mockWindow);
    test.nodeName.toLowerCase().should.equal('style');
    test.childNodes.length.should.equal(1);
    test.childNodes[0].wholeText.should.equal(randomString1);
    // Just for coverage, we do this:
    if (!mockWindow.navigator) {
      mockWindow.document.createElement = function(type) {
        var el = new mocker.MockElement(type);
        el.styleSheet = {};
        return el;
      };
      var randomString2 = 'teststring' + Math.random() * 1000;
      var test2 = app.appendCss(randomString2, mockWindow);
      test2.styleSheet.cssText.should.equal(randomString2);
    }
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
    var mockWindow = new mocker.Window().window;
    var a = app.init(mockWindow);
    // See that some values are set as expected.
    if (typeof(window) === 'undefined') {
      a.window.mockElements[a.window.mockElements.length - 2].id.should.equal('main-wrapper');
    }
  });

  it('Should increase coverage with a few random tests', function() {
    var mockWindow = new mocker.Window(true).window;
    var a = app.init(mockWindow);
    a.m.route().should.equal('/');
    var r = a.window.mockElements[a.window.mockElements.length - 1].onclick();
    a.m.route().should.equal('/');
    r.should.equal(false);
    a.m.route('/node/1');
    a.m.route().should.equal('/node/1');
    r = a.window.mockElements[a.window.mockElements.length - 1].onclick();
    r.should.equal(false);
    a.m.route().should.equal('/');
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
    de.id = 'disqus_thread';
    mockWindow.document.getElementsByTagName('body')[0].appendChild(de);
    mockWindow.disqus_shortname = 'testtest' + Math.random() * 1000;
    disqus(mockWindow);
    mockWindow.scrollY = 1000;
    mockWindow.onscroll();
    var el;
    if (typeof(window) === 'undefined') {
      el = mockWindow.mockElements[3];
    }
    else {
      el = document.getElementsByTagName('script')[0];
    }
    el.src.should.equal(mockWindow.location.protocol + '//' + mockWindow.disqus_shortname + '.disqus.com/embed.js?url=' + m.route());
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
    var ge, se;
    var gid;
    if (typeof(window) === 'undefined') {
      ge = mockWindow.mockElements[0];
      se = mockWindow.mockElements[3];
      gid = 'undefined';
    }
    else {
      ge = mockWindow.document.getElementsByTagName('gist')[0];
      var s = mockWindow.document.getElementsByTagName('script');
      for (var i = 0, len = s.length; i < len; i++) {
        var n = s[i];
        if (n.src.indexOf('github')) {
          se = n;
        }
      }
      gid = 123;
    }
    ge.nodeName.toLowerCase().should.equal('gist');
    se.nodeName.toLowerCase().should.equal('script');
    se.src.should.equal('https://gist.github.com/' + gid + '.json?callback=' + cb);
    // Try to call the callback
    var style = 'test' + Math.random() * 1000;
    var div = 'test' + Math.random() * 1000;
    var preLength = mockWindow.document.body.childNodes.length;
    mockWindow[cb]({stylesheet: style, div: div});
    mockWindow.document.body.childNodes.length.should.equal(preLength - 1);
    if (typeof(window) === 'undefined') {
      ge = mockWindow.mockElements[2];
    }
    ge.innerHTML.should.equal('<link rel="stylesheet" href="' + style + '">' + div);
  });
});
