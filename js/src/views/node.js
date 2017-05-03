/** @jsx m */

var m = require('mithril');
module.exports = view;

function view(ctrl) {

  var terms = ctrl.tags().map(function(n) {
    return {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"/taxonomy/term/{n.tid}",hreflang:"en"}, children: [n.title]}]}
  });

  return {tag: "main", attrs: {id:"content",class:"column",role:"main"}, children: [{tag: "section", attrs: {class:"section"}, children: [{tag: "div", attrs: {class:"content"}, children: [
    {tag: "article", attrs: {class:"node node--view-mode-full clearfix",about:"/aa-cc",typeof:"schema:Article"}, children: [
      {tag: "h1", attrs: {class:"title",id:"page-title"}, children: [ctrl.title()]}, 
      {tag: "div", attrs: {class:"node__meta"}, children: [
        ctrl.submitted()
      ]}, 
      {tag: "div", attrs: {class:"node__content clearfix "}, children: [
        {tag: "p", attrs: {}, children: [m.trust(ctrl.body())]}
      ]}, 
      {tag: "div", attrs: {class:ctrl.imageClass() + ' image',onclick:ctrl.toggleImageClass}, children: [
        {tag: "img", attrs: {src:ctrl.image()}}, 
        {tag: "h2", attrs: {}, children: ["Play"]}
      ]}, 
      {tag: "div", attrs: {class:"clearfix field-type-taxonomy-term-reference"}, children: [
        {tag: "ul", attrs: {class:"links field-items"}, children: [
          terms
        ]}
      ]}
    ]}, 
    {tag: "div", attrs: {class:"twitter"}, children: [
      "This blog is written by me, ",{tag: "a", attrs: {href:"https://twitter.com/orkj"}, children: ["eiriksm. Feel free to say hi on twitter."]}
    ]}, 
    {tag: "div", attrs: {id:"disqus_thread"}}
  ]}]}]}
}
