(function() {
  h1("There was something wrong with your submission");
  section({
    "class": "error"
  }, function() {
    var _ref, _ref2;
    return h2((_ref = (_ref2 = this.error) != null ? _ref2.message : void 0) != null ? _ref : "The server can't seem to remember what, though.");
  });
}).call(this);
