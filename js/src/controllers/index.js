var indexView = require('../views/index');
var http = require('../http');
var app = {};

app.controller = function(window) {
  return function() {
    this.window = window;
    var ctrl = this;
    // Try to find the list of nodes.
    this.nodes = m.prop([]);
    http('node')
    .then(function(data) {
      ctrl.nodes = data;
      // Attach event listeners on all taxonomy links.
      var taxAttach = function() {
        if (document && document.querySelectorAll) {
          var taxes = document.querySelectorAll('.field-type-taxonomy-term-reference a');
          var linkfunction = function() {
            var url = this.getAttribute('href');
            if (url) {
              m.route(url);
              return false;
            }
          };
          for (var i = 0, len = taxes.length; i < len; i++) {
            var link = taxes[i];
            link.onclick = linkfunction;
          }
        }
      };
      // Wait for a while to try to attach taxonomy listeners.
      setTimeout(taxAttach, 2);
      // Try to find comment count.
      window.disqus_shortname = '{{ disqus_shortname }}';
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
  };
};
app.view = indexView;
module.exports = function(window) {
  this.controller = app.controller(window);
  this.view = app.view;
  return this;
};
