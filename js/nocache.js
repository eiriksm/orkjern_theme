;(function() {
  var util = require('./src/app');
  var style = document.getElementsByTagName('style')[0];
  if (style) {
    var ls = util.getLsOrKickOut(window);
    var key = '{{cache_key}}';
    var data = {};
    data[key] = style.innerHTML;
    ls.setItem('orkjern_theme_cache', JSON.stringify(data));
    document.cookie = "ORKJERN_THEME_CACHE={{ cache_key }}";
  }
  // Init the app.
  util.init(window);
}());
