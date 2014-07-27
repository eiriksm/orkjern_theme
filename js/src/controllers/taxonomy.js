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
  });
};
app.view = indexView;
module.exports = app;
