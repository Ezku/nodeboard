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
  section({
    "class": 'form'
  }, function() {
    return form({
      method: 'post',
      action: "/" + this.board + "/" + this.thread.id + "/"
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
}).call(this);
