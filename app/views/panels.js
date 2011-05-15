(function() {
  div({
    id: "high-level"
  }, function() {
    var _ref;
    if ((_ref = this.overview) != null ? _ref.view : void 0) {
      return div(function() {
        return text(this.partial(this.overview.view, this.overview));
      });
    }
  });
  div({
    id: "detail-level"
  }, function() {
    var _ref;
    if ((_ref = this.detail) != null ? _ref.view : void 0) {
      return div(function() {
        return text(this.partial(this.detail.view, this.detail));
      });
    }
  });
}).call(this);
