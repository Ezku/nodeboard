(function() {
  section({
    "class": 'thread',
    id: 'thread-' + this.thread.id
  }, function() {
    var post, _i, _len, _ref, _results;
    h4('Thread ' + this.thread.id);
    _ref = this.thread.posts;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      post = _ref[_i];
      _results.push(text(this.partial("partials/post", {
        object: post
      })));
    }
    return _results;
  });
  text(this.partial("partials/post-form", {
    as: 'form',
    object: {
      action: "/" + this.board + "/" + this.thread.id + "/",
      submit: 'Reply to thread'
    }
  }));
}).call(this);
