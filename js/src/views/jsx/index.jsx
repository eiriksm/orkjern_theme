/** @jsx m */

module.exports = view;

function view(ctrl) {
  var renderListItem = function(item) {
    return <article class="node node--view-mode-teaser clearfix" about="/aa-cc" typeof="schema:Article">
      <h2 class="node__title "><a href={item.path} config={m.route}>{item.title}</a></h2>
      <div class="node__meta">
        Submitted {item.created}
      </div>
      <div class="node-content" property="schema:text">{m.trust(item.body)}</div>
      <div class="read-more"><a href={item.path} config={m.route}>Read more</a></div>
      {m.trust(item.field_tags)}
    </article>
  }
  return <div class="content">
    <div>{ ctrl.nodes.map(renderListItem) }</div>
  </div>
}