/** @jsx m */

module.exports = view;

function view(ctrl) {
  var window = ctrl.window;
  var urlPrefix = window.location.host;
  var renderListItem = function(item) {
    return m("article", {class:"node node--view-mode-teaser clearfix", about:"/aa-cc", typeof:"schema:Article"}, [
      m("h2", {class:"node__title " }, [m("a", {href:item.path, config:m.route}, [item.title])]),
      m("div", {class:"node__meta"}, [
        "Submitted ", item.created
      ]),
      m("div", {class:"read-more"}, [m("a", {href:'//' + urlPrefix + item.path, config:m.route}, ["Read more"])]),
      m("div", {class:"comment-count"}, [m("a", {'data-disqus-identifier':item.path, href:item.path, config:m.route})]),
      m.trust(item.field_tags)
    ])
  }
  return m("div", {class:"content"}, [
    m("div", [ ctrl.nodes.map ? ctrl.nodes.map(renderListItem) : ''])
  ])
}
