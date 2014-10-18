/** @jsx m */

module.exports = view;

function view(ctrl) {
  var renderListItem = function(item) {
    return m("article", {class:"node node--view-mode-teaser clearfix", about:"/aa-cc", typeof:"schema:Article"}, [
      m("h2", {class:"node__title " }, [m("a", {href:item.path, onclick:function(){ctrl.navigate(this);return false;}}, [item.title])]),
      m("div", {class:"node__meta"}, [
        "Submitted ", item.created
      ]),
      m("div", {class:"read-more"}, [m("a", {href:item.path, onclick:function(){ctrl.navigate(this);return false;}}, ["Read more"])]),
      m("div", {class:"comment-count"}, [m("a", {'data-disqus-identifier':item.path, href:item.path,  onclick:function(){ctrl.navigate(this);return false;}})]),
      m.trust(item.field_tags)
    ])
  }
  return m("div", {class:"content"}, [
    m("div", [ ctrl.nodes.map ? ctrl.nodes.map(renderListItem) : ''])
  ])
}
