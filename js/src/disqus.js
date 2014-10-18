var disqus = function(window) {
  var document = window.document;
  var init = function() {
    if (!window.disqus_shortname) {
      return;
    }
    window.disqus_identifier = m.route();
    if (window.disqus_loaded) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = window.disqus_identifier;
          this.page.url = window.location.origin + window.disqus_identifier;
        }
      });
      return;
    }
    window.disqus_loaded = true;
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + window.disqus_shortname + '.disqus.com/embed.js?url=' + window.disqus_identifier;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  };
  var disqus_el = document.getElementById('disqus_thread');
  var inited = false;
  window.onscroll = function() {
    if (!disqus_el) {
      disqus_el = document.getElementById('disqus_thread');
    }
    if (inited) {
      return;
    }
    // See if we can determine something about when this element is in sight.
    if (window.scrollY && disqus_el && disqus_el.offsetTop && window.innerHeight) {
      // Visible within 50 px.
      if (window.scrollY + window.innerHeight + 50 > disqus_el.offsetTop) {
        inited = true;
        init();
      }
    }
  };
};

module.exports = disqus;
