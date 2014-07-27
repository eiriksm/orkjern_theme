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
      m("div", {class:"image"}, [
        m("img", {src:ctrl.image()} )
      ])
    ]),
    m("div", {id:"disqus_thread"})
  ])
}
