(function() {
  div({
    "class": 'columnHeader'
  }, function() {
    return h1(this.title);
  });
  div({
    "class": 'columnContent'
  }, function() {
    return section({
      "class": 'thread',
      id: 'thread-' + this.thread.id
    }, function() {
      var post, _i, _len, _ref, _ref2, _results;
      if ((_ref = this.thread.posts) != null ? _ref.length : void 0) {
        _ref2 = this.thread.posts;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          post = _ref2[_i];
          post.board = this.thread.board;
          post.thread = this.thread.id;
          _results.push(text(this.partial("partials/post", {
            object: post
          })));
        }
        return _results;
      }
    });
  });
  div({
    "class": 'columnFooter'
  }, function() {
    var _ref;
    if (((_ref = this.thread.posts) != null ? _ref.length : void 0) || this.jQtemplate) {
      return text(this.partial("partials/post-form", {
        as: 'form',
        object: {
          action: "/" + this.board + "/" + this.thread.id + "/",
          submit: 'Reply to thread',
          id: "reply",
          title: "Reply to thread"
        }
      }));
    }
  });
}).call(this);
