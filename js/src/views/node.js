/** @jsx m */

module.exports = view;

function view(ctrl) {
  return m("div", {class:"content"}, [
    m("article", {class:"node node--view-mode-full clearfix", about:"/aa-cc", typeof:"schema:Article"}, [
      m("h1", {class:"title", id:"page-title"}, [ctrl.title()]),
      m("div", {class:"node__meta"}, [
        ctrl.submitted()
      ]),
      m("div", {class:"node__content clearfix " }, [
        m("p", [m.trust(ctrl.body())])
      ]),
      m("div", {class:ctrl.imageClass() + ' image', onclick:ctrl.toggleImageClass}, [
        m("img", {src:ctrl.image()} ),
        m("h2", ["Play"])
      ])
    ]),
    m("div", {id:"disqus_thread"})
  ])
}
