(function() {
  var _ref, _ref2;
  h1((_ref = (_ref2 = this.error) != null ? _ref2.message : void 0) != null ? _ref : "Looking for something?");
  section({
    "class": "error"
  }, function() {
    var _ref3, _ref4;
    return h2((_ref3 = (_ref4 = this.error) != null ? _ref4.description : void 0) != null ? _ref3 : "Well, it's not here.");
  });
}).call(this);
