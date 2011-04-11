(function() {
  var thread, _i, _len, _ref;
  section({
    "class": 'form'
  }, function() {
    return form({
      method: 'post',
      action: "/" + this.board + "/"
    }, function() {
      return dl(function() {
        dt(function() {
          return label({
            "for": "content"
          }, function() {
            return "Content";
          });
        });
        dd(function() {
          return textarea({
            name: 'content',
            id: 'content'
          });
        });
        dt(function() {
          return label({
            "for": "password"
          }, function() {
            return "Password";
          });
        });
        dd(function() {
          return input({
            name: 'password',
            id: 'password',
            type: 'password'
          });
        });
        dt(function() {});
        return dd(function() {
          return input({
            name: 'submit',
            type: 'submit',
            value: 'Submit'
          });
        });
      });
    });
  });
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
