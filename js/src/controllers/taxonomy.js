var indexView = require('../views/index');
var http = require('../http');
var app = {};

app.controller = function() {
  var ctrl = this;
  // Try to find the list of nodes.
  this.nodes = m.prop([]);
  var tid = m.route.param('tid');
  http('taxonomy/term/' + tid)
  .then(function(data) {
    data.map(function(item) {
      item.body = '';
    });
    ctrl.nodes = data;
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
app.view = indexView;
module.exports = app;
