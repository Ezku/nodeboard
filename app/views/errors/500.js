(function() {
  var _ref, _ref2;
  h1((_ref = (_ref2 = this.error) != null ? _ref2.message : void 0) != null ? _ref : "Looks like we messed up");
  section({
    "class": "error"
  }, function() {
    var _ref3, _ref4;
    return h2((_ref3 = (_ref4 = this.error) != null ? _ref4.description : void 0) != null ? _ref3 : "Sorry about that. It's probably nothing fatal. If you were doing something, please try again.");
  });
}).call(this);
