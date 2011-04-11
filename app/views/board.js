(function() {
  var thread, _i, _len, _ref;
  text(this.partial("partials/post-form", {
    as: 'form',
    object: {
      action: "/" + this.board + "/",
      submit: 'Create thread'
    }
  }));
  _ref = this.threads;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    thread = _ref[_i];
    section({
      "class": 'thread',
      id: 'thread-' + thread.id
    }, function() {
      var replyCount;
      h4(function() {
        return a({
          href: "/" + this.board + "/" + thread.id + "/"
        }, function() {
          return "Thread " + thread.id;
        });
      });
      text(this.partial("partials/post", {
        object: thread.posts[0]
      }));
      replyCount = thread.posts.length - 1;
      if (replyCount > 1) {
        p(replyCount - 1 + " messages omitted.");
      }
      if (replyCount > 0) {
        return text(this.partial("partials/post", {
          object: thread.posts[replyCount]
        }));
      }
    });
  }
}).call(this);
