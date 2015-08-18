var indexView = require('../views/index');
var http = require('../http');
var controller = {};

var TaxController = function(app) {
  var m = app.m;
  return function() {
    var ctrl = this;
    // Try to find the list of nodes.
    this.nodes = m.prop([]);
    var tid = m.route.param('tid');
    http('api/taxonomy/term/' + tid)
    .then(function(data) {
      data.map(function(item) {
        item.body = '';
      });
      ctrl.nodes = data;
      // Try to find comment count.
      window.disqus_shortname = '{{ disqus_shortname }}';
      // Attach event listeners on all taxonomy links.
      var linkAttach = function() {
        app.booter.attach('.field-type-taxonomy-term-reference a');
      };
      // Wait for a while to try to attach taxonomy listeners.
      setTimeout(linkAttach, 2);
      // That is... unless there is no disqus set up for this site.
      if (!window.disqus_shortname || !window.disqus_shortname.length) {
        return;
      }
      window.DISQUSWIDGETS = undefined;
      (function () {
        var s = document.createElement('script'); s.async = true;
        s.type = 'text/javascript';
        s.src = '//' + window.disqus_shortname + '.disqus.com/count.js';
        (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
      }());
    });
    this.navigate = function(el) {
      app.booter.navigateEl(el, app.booter);
    };
  };
};
controller.view = indexView;
module.exports = function(app) {
  controller.controller = new TaxController(app);
  return controller;
};
