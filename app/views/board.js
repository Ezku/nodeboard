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
      h4('Thread ' + thread.id);
      console.log(thread.firstPost);
      text(this.partial("partials/post", {
        object: thread.firstPost
      }));
      p(thread.replyCount + " messages omitted.");
      return text(this.partial("partials/post", {
        object: thread.lastPost
      }));
    });
  }
}).call(this);
