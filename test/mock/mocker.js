function MockElement(type) {
  return {
    id: Math.random() * 1000,
    type: type,
    childNodes: [],
    offsetTop: 10,
    appendChild: function(el) {

      this.childNodes.push(el);
      el.parentNode = this;
      return this;
    },
    attributes: {},
    setAttribute: function(attr, val) {
      this.attributes[attr] = val;
    },
    removeChild: function(el) {
      for (var i = 0, len = this.childNodes.length; i < len; i++) {
        if (this.childNodes[i].id == el.id) {
          this.childNodes.splice(i, 1);
        }
      }
    }
  };
}
function MockWindow() {
  var mockWindow;
  this.window = {
    mockElements: [],
    document: {
      body: new MockElement('body'),
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
    scrollY: 1000,
    innerHeight: 100,
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
  mockWindow = this.window;
}
exports.Window = MockWindow;
exports.MockElement = MockElement;
