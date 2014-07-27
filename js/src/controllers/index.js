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
    // Attach event listeners on all taxonomy links.
    var taxAttach = function() {
      if (document && document.querySelectorAll) {
        var taxes = document.querySelectorAll('.field-type-taxonomy-term-reference a');
        for (var i = 0, len = taxes.length; i < len; i++) {
          var link = taxes[i];
          link.onclick = function() {
            var url = link.getAttribute('href');
            if (url) {
              m.route(url);
              return false;
            }
          };
        }
      }
    };
    // Wait for a while to try to attach taxonomy listeners.
    setTimeout(taxAttach, 2);
  });
};
app.view = indexView;
module.exports = app;
