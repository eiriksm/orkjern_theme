var m = require('mithril');

var node = require('./controllers/node');
var index = require('./controllers/index');
var taxonomy = require('./controllers/taxonomy');

module.exports = {
  appendCss: appendCss,
  getLsOrKickOut: getLsOrKickOut,
  init: init
};

function appendCss(append, window) {
  var head = document.getElementsByTagName('head')[0];
  var elem = document.createElement('style');
  elem.type = 'text/css';
  if (elem.styleSheet){
    elem.styleSheet.cssText = append;
  }
  else {
    elem.appendChild(document.createTextNode(append));
  }
  return head.appendChild(elem);
}

function getLsOrKickOut(window){
  var ls = window.localStorage;
  if (!ls) {
    // Christ. No localstorage. The following is deserved:
    alert('Your browser is bad, and you should feel bad. You are not welcome here. You will be redirected to a place where you can upgrade your browser.');
    return window.location.href = 'http://browsehappy.com/';
  }
  return ls;
}
function init() {
  m.route.mode = 'pathname';
  var routeConf = {};
  routeConf['/'] = index;
  routeConf['/node'] = index;
  routeConf['/:alias'] = node;
  routeConf['/node/:nid'] = node;
  routeConf['/taxonomy/term/:tid'] = taxonomy;
  m.route(document.getElementById('main-wrapper'), '/', routeConf);

  // Hijack the links coming from the logo also.
  var l = document.getElementById('logo');
  l.onclick = function(e) {
    // Only redirect if we are not already on the front page.
    var url = m.route();
    if (url !== '/') {
      m.route('/');
    }
    return false;
  };
}
