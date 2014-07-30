/** @jsx m */

module.exports = view;

function view(ctrl) {
  return <div class="content">
    <article class="node node--view-mode-full clearfix" about="/aa-cc" typeof="schema:Article">
      <h1 class="title" id="page-title">{ctrl.title()}</h1>
      <div class="node__meta">
        {ctrl.submitted()}
      </div>
      <div class="node__content clearfix ">
        <p>{m.trust(ctrl.body())}</p>
      </div>
      <div class={ctrl.imageClass() + ' image'} onclick={ctrl.toggleImageClass}>
        <img src={ctrl.image()} />
        <h2>Play</h2>
      </div>
    </article>
    <div id="disqus_thread"></div>
  </div>
}
