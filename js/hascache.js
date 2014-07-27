;(function() {
  var util = require('./src/app');
  var ls = util.getLsOrKickOut(window);
  var key = '{{cache_key}}';
  try {
    var cacheData = ls.getItem('orkjern_theme_cache');
    if (!cacheData) {
      throw new Error('Have no cache data');
    }
    var cache = JSON.parse(cacheData);
    if (!cache) {
      throw new Error('Can not parse data');
    }
    if (!cache[key]) {
      throw new Error('Have old cache');
    }
    util.appendCss(cache[key], window);
  }
  catch (err) {
    ls.clear('orkjern_theme_cache');
    // Oops. Something must have gone wrong. Unset cookie and reload.
    document.cookie = "ORKJERN_THEME_CACHE=123";
    window.location.reload();
  }
  // Init the app.
  util.init();
}());
