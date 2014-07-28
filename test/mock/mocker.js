function MockElement(type) {
  return {
    type: type,
    childNodes: [],
    appendChild: function(el) {
      this.childNodes.push(el);
      return this;
    }
  };
}
var mockWindow = {
  mockElements: [],
  document: {
    getElementsByTagName: function(type) {
      var el = new MockElement(type);
      mockWindow.mockElements.push(el);
      return [el];
    },
    getElementById: function(id) {
      var el = new MockElement('div');
      el.id = id;
      mockWindow.mockElements.push(el);
      return el;
    },
    createElement: function(type) {
      var el = new MockElement(type);
      mockWindow.mockElements.push(el);
      return el;
    },
    createTextNode: function(text) {
      return {text: text};
    }
  },
  XMLHttpRequest: function() {
    var Request = function() {
      this.$headers = {};
      this.setRequestHeader = function(key, value) {
        this.$headers[key] = value;
      };
      this.open = function(method, url) {
        this.method = method;
        this.url = url;
      };
      this.send = function() {
        this.responseText = JSON.stringify(this);
        this.readyState = 4;
        this.status = 200;
        Request.$instances.push(this);
      };
    };
    Request.$instances = [];
    return new Request();
  },
  location: {
    search: "",
    pathname: "",
    hash: ""
  },
  test: true,
  history: {
    pushState: function(data, title, url) {
      window.location.pathname = window.location.search = window.location.hash = url;
    },
    replaceState: function(data, title, url) {
      window.location.pathname = window.location.search = window.location.hash = url;
    }
  }

};
exports.window = mockWindow;
exports.MockElement = MockElement;
