(function() {
  div({
    id: "high-level"
  }, function() {
    if (this.overview.view) {
      if (this.overview.title) {
        h1(this.overview.title);
      }
      return div(function() {
        return text(this.partial(this.overview.view, this.overview));
      });
    }
  });
  div({
    id: "detail"
  }, function() {
    if (this.detail.view) {
      if (this.detail.title) {
        h1(this.detail.title);
      }
      return div(function() {
        return text(this.partial(this.detail.view, this.detail));
      });
    }
  });
}).call(this);
