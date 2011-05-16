(function() {
  div({
    id: 'boardHeader'
  }, function() {
    return h1("Most recent threads");
  });
  div({
    id: 'boardContent'
  }, function() {
    return div({
      id: 'threads'
    }, function() {
      var thread, _i, _len, _ref, _results;
      if (this.threads.length) {
        _ref = this.threads;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          thread = _ref[_i];
          _results.push(text(this.partial("partials/thread", {
            object: thread
          })));
        }
        return _results;
      } else {
        return h2("Wow! There's absolutely nothing to see here!");
      }
    });
  });
}).call(this);
