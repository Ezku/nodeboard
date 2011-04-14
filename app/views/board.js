(function() {
  var thread, _i, _len, _ref;
  h1(this.title);
  a({
    id: "newThreadButton",
    href: "#newThread"
  }, function() {
    return "New Thread";
  });
  text(this.partial("partials/post-form", {
    as: 'form',
    object: {
      action: "/" + this.board + "/",
      submit: 'Create thread',
      id: 'newThread'
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
      a({
        href: "/" + this.board + "/" + thread.id + "/",
        "class": "threadLink"
      });
      text(this.partial("partials/post", {
        object: thread.posts[0]
      }));
      replyCount = thread.posts.length - 1;
      if (replyCount > 1) {
        p({
          "class": "omitted"
        }, function() {
          return replyCount - 1 + " messages omitted.";
        });
      }
      if (replyCount > 0) {
        return text(this.partial("partials/post", {
          object: thread.posts[replyCount]
        }));
      }
    });
  }
}).call(this);
