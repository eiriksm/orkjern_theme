module.exports = Booter;

function Booter(app) {
  this.app = app;
  this.window = app.window;
  var index = app.controllers.index;
  var node = app.controllers.node;
  var taxonomy = app.controllers.taxonomy;
  this.booted = false;
  this.routeConf = {};
  this.routeConf['/'] = index;
  this.routeConf['/node'] = index;
  this.routeConf['/:alias'] = node;
  this.routeConf['/node/:nid'] = node;
  this.routeConf['/taxonomy/term/:tid'] = taxonomy;

  var m = this.app.m;
  this.m = m;
  var d = this.window.document;
  var _b = this;

  this.startFunction = function() {
    var url = this.getAttribute('href');
    _b.navigate(url);
    // Oh yeah, we are taking over, man.
    return false;
  };

  var l = d.querySelector('.site-name a');
  if (l) {
    l.onclick = function() {
      // Only redirect if we are not already on the front page.
      var url = m.route();
      if (url !== '/') {
        _b.navigate('/');
      }
      return false;
    };
  }
}

Booter.prototype.attach = function(sel) {
  console.log(sel)
  var selector = sel || '#main-wrapper a';
  // Hijack all links content links.
  var d = this.window.document;
  if (d && d.querySelectorAll) {
    var links = d.querySelectorAll(selector);
    for (var i = 0, len = links.length; i < len ; i++) {
      var internal = false;
      var internalDomain = window.location.protocol + '//' + window.location.hostname;
      if (links[i].href.indexOf(internalDomain) === 0) {
        internal = true;
      }
      if (links[i].href.indexOf('/') === 0) {
        internal = true;
      }
      if (internal) {
        links[i].onclick = this.startFunction;
      }
    }
  }
}

Booter.prototype.navigate = function(url) {
  var win = this.window;
  if (!this.booted && win && win.document) {
    this.m.route(win.document.getElementById('main-wrapper'), url, this.routeConf);
    this.booted = true;
  }
  this.m.route(url);
};
Booter.prototype.navigateEl = function(el, b) {
  var url = el.getAttribute('href');
  b.navigate(url);
  return false;
};
