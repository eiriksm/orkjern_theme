/** @jsx m */

module.exports = view;

function view(ctrl) {
  var renderListItem = function(item) {
    return <article class="node node--view-mode-teaser clearfix" about="/aa-cc" typeof="schema:Article">
      <h2 class="node__title "><a href={item.path} onclick={function(){ctrl.navigate(this);return false;}}>{item.title}</a></h2>
      <div class="node__meta">
        Post date: {item.created}
      </div>
      <div class="read-more"><a href={item.path} onclick={function(){ctrl.navigate(this);return false;}}>Read more</a></div>
      <div class="comment-count"><a data-disqus-identifier={item.path} href={item.path}  onclick={function(){ctrl.navigate(this);return false;}}></a></div>
      {m.trust(item.field_tags)}
    </article>
  }
  return <main id="content" class="column" role="main"><section class="section"><div class="content">
    <div>{ ctrl.nodes.map ? ctrl.nodes.map(renderListItem) : ''}</div>
  </div></main></section>
}
