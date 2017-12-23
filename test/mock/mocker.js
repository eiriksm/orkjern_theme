function MockElement(type) {
  return {
    id: Math.random() * 1000,
    type: type,
    nodeName: type.toUpperCase(),
    attributes: {
      type: type,
      0: {
        nodeValue: type
      }
    },
    childNodes: [],
    offsetTop: 10,
    appendChild: function(el) {
      this.childNodes.push(el);
      el.parentNode = this;
      return el;
    },
    setAttribute: function(attr, val) {
      this.attributes[attr] = val;
      this[attr] = val;
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
function MockWindow(forceFake) {
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
        return {wholeText: text};
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
      search: '',
      pathname: '',
      hash: '',
      protocol: ''
    },
    navigator: {
      userAgent: 'Test agent'
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
  if (!forceFake && typeof(window) !== 'undefined') {
    this.window = window;
  }
  else if (typeof(window) === 'undefined') {
    // Trick browserify.
    var r = {
      r: require
    };
    var JSDOM = r.r('jsdom').JSDOM;
    var doc = new JSDOM();
    var loc = this.window.location;
    this.window = doc.window;
    this.window.location = loc;
    this.window.test = true;
  }
  mockWindow = this.window;
}
exports.Window = MockWindow;
exports.MockElement = MockElement;
