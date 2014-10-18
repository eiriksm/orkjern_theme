var indexView = require('../views/index');
var http = require('../http');
var ctrl = {};

var IndexController = function(app) {
  return function() {
    var window = app.window;
    var ctrl = this;
    // Try to find the list of nodes.
    this.nodes = m.prop([]);
    http('node')
    .then(function(data) {
      ctrl.nodes = data;
      // Attach event listeners on all taxonomy links.
      var linkAttach = function() {
        app.booter.attach('.field-type-taxonomy-term-reference a');
      };
      // Wait for a while to try to attach taxonomy listeners.
      setTimeout(linkAttach, 2);
    });
    this.navigate = function(el) {
      app.booter.navigateEl(el, app.booter);
    };
  };
};
ctrl.view = indexView;
module.exports = function(a) {
  ctrl.app = a;
  ctrl.controller = new IndexController(a);
  return ctrl;
};
