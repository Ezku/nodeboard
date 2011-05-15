(function() {
  h1("Looks like you did something you were not supposed to do");
  section({
    "class": "error"
  }, function() {
    var _ref, _ref2;
    return h2((_ref = (_ref2 = this.error) != null ? _ref2.message : void 0) != null ? _ref : "The server can't seem to remember what, though.");
  });
}).call(this);
