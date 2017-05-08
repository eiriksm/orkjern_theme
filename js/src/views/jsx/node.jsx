/** @jsx m */

var m = require('mithril');
module.exports = view;

function view(ctrl) {

  var terms = ctrl.tags().map(function(n) {
    var href = '/taxonomy/term/' + n.tid;
    return (<li><a href={href} hreflang="en">{n.title} </a> </li> );
  });

  return <main id="content" class="column" role="main"><section class="section"><div class="content">
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
      <div class="clearfix field-type-taxonomy-term-reference">
        <ul class="links field-items">
          {terms}
        </ul>
      </div>
    </article>
    <div class="twitter">
      This blog is written by me, <a href="https://twitter.com/orkj">eiriksm. Feel free to say hi on twitter.</a>
    </div>
    <div id="disqus_thread"></div>
  </div></section></main>
}
