(function() {
  div({
    id: "high-level"
  }, function() {
    if (this.overview.view) {
      return div(function() {
        return text(this.partial(this.overview.view, this.overview));
      });
    }
  });
  div({
    id: "detail-level"
  }, function() {
    if (this.detail.view) {
      return div(function() {
        return text(this.partial(this.detail.view, this.detail));
      });
    }
  });
}).call(this);
