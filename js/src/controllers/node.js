var nodeView = require('../views/node');
var http = require('../http');
var gist = require('../gist');

var app = {};
app.controller = function() {
  var ctrl = this;
  this.title = m.prop('');
  this.body = m.prop('Loading...');
  this.raw = m.prop({});
  this.image = m.prop('');
  ctrl.submitted = m.prop('');
  // See how we should construct the request.
  var url = m.route.param('alias');
  var nid = m.route.param('nid');
  if (!url) {
    if (!nid) {
      m.route('/');
      return;
    }
    url = 'node/' + nid;
  }

  http(url)
  .then(function success(data) {
    var cr = new Date(data.created[0].value * 1000);
    ctrl.title(data.title[0].value);
    ctrl.body(data.body[0].value);
    ctrl.submitted('Submitted ' + cr.toLocaleDateString());
    // Try to find some fields we need.
    // @todo. This should be handled better, and without a loop.
    for (var prop in data._links) {
      if (prop.indexOf('image') < 1) {
        continue;
      }
      if (data._links.hasOwnProperty(prop)) {
        // We are looking for these 2 fields:
        if (prop.indexOf('image')) {
          ctrl.image(data._links[prop][0].href);
        }
      }
    }
    ctrl.raw = data;
    setTimeout(gist, 1);
    var disqus_shortname = 'orkjblog';
    window.disqus_identifier = window.location.pathname;
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
  }, function error(data) {
    if (data === 404) {
      ctrl.title('404 not found!');
      ctrl.body('The page you are looking for is nowhere to be found. Real sorry about that!');
    }
    if (data === 403) {
      ctrl.title('403 Forbidden!');
      ctrl.body('You are not allowed to access this page. I am guessing you already knew that!');
    }
  });
};
app.view = nodeView;
module.exports = app;
