(function() {
  div({
    id: "high-level",
    "class": "column"
  }, function() {
    var _ref;
    if ((_ref = this.overview) != null ? _ref.view : void 0) {
      return div(function() {
        return text(this.partial(this.overview.view, this.overview));
      });
    }
  });
  div({
    id: "detail-level",
    "class": "column"
  }, function() {
    var _ref;
    if ((_ref = this.detail) != null ? _ref.view : void 0) {
      return div(function() {
        return text(this.partial(this.detail.view, this.detail));
      });
    }
  });
}).call(this);
