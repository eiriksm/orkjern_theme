var m = require('mithril');

var nodeView = require('../views/node');
var http = require('../http');
var gist = require('../gist');
var disqus = require('../disqus');

var app = {};
app.controller = function() {
  var ctrl = this;
  this.title = m.prop('');
  this.body = m.prop('Loading...');
  this.raw = m.prop({});
  this.tags = m.prop([]);
  this.image = m.prop('about:blank');
  ctrl.submitted = m.prop('');
  var image;

  // Do not auto-play the animated gif.
  this.imageClass = m.prop('noplay');
  this.toggleImageClass = function() {
    m.startComputation();
    ctrl.imageClass('play');
    if (image) {
      ctrl.image(image);
    }
    m.endComputation();
  };
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
    if (!data) {
      return;
    }
    var cr = new Date(data.created[0].value * 1000);
    ctrl.title(data.title[0].value);
    ctrl.body(data.body[0].value);
    ctrl.submitted('Submitted ' + cr.toLocaleDateString());
    // Try to find some fields we need.
    // @todo. This should be handled better, and without a loop.
    var tags = [];
    for (var prop in data._links) {
      if (prop.indexOf('image') < 1 && prop.indexOf('tags') < 1) {
        continue;
      }
      if (data._links.hasOwnProperty(prop)) {
        // We are looking for these 2 fields:
        if (prop.indexOf('image') > 0) {
          image = data._links[prop][0].href;
        }
        if (prop.indexOf('tags') > 0) {
          for (var i = 0, len = data._links[prop].length; i < len; i++) {
            var link = data._links[prop][i].href;
            var tid = link.substring(link.lastIndexOf('/') + 1, link.lastIndexOf('?'));
            if (!orkjernTags[tid]) {
              // Abort!
              continue;
            }
            // Now, create the object we need.
            tags.push({
              tid: tid,
              title: orkjernTags[tid]
            });
          }
        }
      }
    }
    if (tags.length) {
      ctrl.tags(tags);
    }
    ctrl.raw = data;
    setTimeout(function() {
      gist(window);
    }, 200);
    window.disqus_shortname = '{{ disqus_shortname }}';
    setTimeout(function() {
      disqus(window);
    }, 200);
  }, function error(data) {
    if (data === 404) {
      ctrl.title('404 not found!');
      ctrl.body('The page you are looking for is nowhere to be found. Real sorry about that!');
      ctrl.imageClass('hide');
    }
    if (data === 403) {
      ctrl.title('403 Forbidden!');
      ctrl.body('You are not allowed to access this page. I am guessing you already knew that!');
    }
  });
};
app.view = nodeView;
module.exports = app;
