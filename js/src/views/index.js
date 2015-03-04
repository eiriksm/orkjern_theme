/** @jsx m */

var m = require('mithril');
module.exports = view;

function view(ctrl) {
  var renderListItem = function(item) {
    return {tag: "article", attrs: {class:"node node--view-mode-teaser clearfix",about:"/aa-cc",typeof:"schema:Article"}, children: [
      {tag: "h2", attrs: {class:"node__title "}, children: [{tag: "a", attrs: {href:item.path,onclick:function(){ctrl.navigate(this);return false;}}, children: [item.title]}]}, 
      {tag: "div", attrs: {class:"node__meta"}, children: [
        "Post date: ",item.created
      ]}, 
      {tag: "div", attrs: {class:"read-more"}, children: [{tag: "a", attrs: {href:item.path,onclick:function(){ctrl.navigate(this);return false;}}, children: ["Read more"]}]}, 
      {tag: "div", attrs: {class:"comment-count"}, children: [{tag: "a", attrs: {"data-disqus-identifier":item.path,href:item.path,onclick:function(){ctrl.navigate(this);return false;}}}]}, 
      m.trust(item.field_tags)
    ]}
  }
  return {tag: "main", attrs: {id:"content",class:"column",role:"main"}, children: [{tag: "section", attrs: {class:"section"}, children: [{tag: "div", attrs: {class:"content"}, children: [
    {tag: "div", attrs: {}, children: [ ctrl.nodes.map ? ctrl.nodes.map(renderListItem) : '']}
  ]}]}]}
}
