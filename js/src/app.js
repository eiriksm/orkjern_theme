var m = require('mithril');

var Booter = require('./booter');
var disqus = require('./disqus');

var node = require('./controllers/node');
var Index = require('./controllers/index');
var Taxonomy = require('./controllers/taxonomy');

module.exports = {
  appendCss: appendCss,
  getLsOrKickOut: getLsOrKickOut,
  init: init
};

function appendCss(append, window) {
  var d = window.document;
  var head = d.getElementsByTagName('head')[0];
  var elem = d.createElement('style');
  elem.type = 'text/css';
  if (elem.styleSheet){
    elem.styleSheet.cssText = append;
  }
  else {
    elem.appendChild(d.createTextNode(append));
  }
  return head.appendChild(elem);
}

function getLsOrKickOut(window){
  var ls = window.localStorage;
  if (!ls) {
    // Christ. No localstorage. The following is deserved:
    window.alert('Your browser is bad, and you should feel bad. You are not welcome here. You will be redirected to a place where you can upgrade your browser.');
    return window.location.href = 'http://browsehappy.com/';
  }
  return ls;
}
function init(window) {
  var app = {
    window: window,
    m: m
  };
  // Ugly stuff.
  if (window.test) {
    m.deps(window);
  }
  var d = window.document;
  m.route.mode = 'pathname';
  app.controllers = {
    index: new Index(app),
    node: node,
    taxonomy: new Taxonomy(app)
  };
  app.booter = new Booter(app);
  app.booter.attach();
  disqus(app.window);
  // Try to find comment count.
  window.disqus_shortname = '{{ disqus_shortname }}';
  // That is... unless there is no disqus set up for this site.
  if (!window.disqus_shortname || !window.disqus_shortname.length) {
    return app;
  }

  window.DISQUSWIDGETS = undefined;
  (function () {
    var s = d.createElement('script'); s.async = true;
    s.type = 'text/javascript';
    s.src = '//' + window.disqus_shortname + '.disqus.com/count.js';
    (d.getElementsByTagName('HEAD')[0] || d.getElementsByTagName('BODY')[0]).appendChild(s);
  }());
  return app;
}
