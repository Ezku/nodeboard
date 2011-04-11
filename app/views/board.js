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
      h4(function() {
        return a({
          href: "/" + this.board + "/" + thread.id + "/"
        }, function() {
          return "Thread " + thread.id;
        });
      });
      text(this.partial("partials/post", {
        object: thread.firstPost
      }));
      if (thread.replyCount > 1) {
        p((thread.replyCount - 1) + " messages omitted.");
      }
      if (thread.lastPost) {
        return text(this.partial("partials/post", {
          object: thread.lastPost
        }));
      }
    });
  }
}).call(this);
