module.exports = http;

function http(url) {
  var xhrConfig = function(xhr) {
    xhr.setRequestHeader('Accept', 'application/hal+json');
  };
  var nonJsonErrors = function(xhr) {
    if (xhr.status === 200) {
      return xhr.responseText;
    }
    return JSON.stringify(xhr.status);
  };

  return m.request({
    method: 'GET',
    // Append a query string to make sure browser is not caching the URL.
    url: '/' + url + '?json',
    config: xhrConfig,
    extract: nonJsonErrors
  });
}