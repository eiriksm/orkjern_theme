var m = require('mithril');

var node = require('./controllers/node');
var Index = require('./controllers/index');
var taxonomy = require('./controllers/taxonomy');

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
  var routeConf = {};
  var index = new Index(window);
  routeConf['/'] = index;
  routeConf['/node'] = index;
  routeConf['/:alias'] = node;
  routeConf['/node/:nid'] = node;
  routeConf['/taxonomy/term/:tid'] = taxonomy;
  m.route(d.getElementById('main-wrapper'), '/', routeConf);

  // Hijack the links coming from the logo also.
  var l = d.getElementById('logo');
  if (l) {
    l.onclick = function() {
      // Only redirect if we are not already on the front page.
      var url = m.route();
      if (url !== '/') {
        m.route('/');
      }
      return false;
    };
  }
  return app;
}
