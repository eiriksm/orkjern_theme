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
    window.disqus_shortname = '{{ disqus_shortname }}';
    window.DISQUSWIDGETS = undefined;
    (function () {
      var s = document.createElement('script'); s.async = true;
      s.type = 'text/javascript';
      s.src = 'http://' + window.disqus_shortname + '.disqus.com/count.js';
      (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
    }());
  });
};
app.view = indexView;
module.exports = app;
