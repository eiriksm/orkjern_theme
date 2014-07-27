var indexView = require('../views/index');
var http = require('../http');
var app = {};

app.controller = function() {
  var ctrl = this;
  // Try to find the list of nodes.
  this.nodes = m.prop([]);
  http('node')
  .then(function(data) {
    ctrl.nodes = data;
  });
};
app.view = indexView;
module.exports = app;
