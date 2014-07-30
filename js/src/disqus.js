var disqus = function(window) {
  var document = window.document;
  (function() {
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
  })();
};

module.exports = disqus;
