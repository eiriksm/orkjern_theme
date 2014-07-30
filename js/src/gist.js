module.exports = function(window) {
  var document = window.document;
  var gistIt = function(element, gistId) {
    var callbackName = 'gist_callback' + Math.floor(Math.random() * 1000);
    window[callbackName] = function (gistData) {
        delete window[callbackName];
        var html = '<link rel="stylesheet" href="' + (gistData.stylesheet) + '"></link>';
        html += gistData.div;
        element.innerHTML = html;
        script.parentNode.removeChild(script);
        element.className += 'processed';
    };
    var script = document.createElement("script");
    script.setAttribute("src", "https://gist.github.com/" + gistId + ".json?callback=" + callbackName);
    document.body.appendChild(script);
  };
  // Get all gist tags.
  var gists = document.getElementsByTagName('gist');
  for (var i = 0, len = gists.length; i < len; i++) {
    var item = gists[i];
    gistIt(item, item.innerHTML);
  }
};
