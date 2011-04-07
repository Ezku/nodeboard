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
      var post, _i, _len, _ref, _results;
      h4('Thread ' + thread.id);
      _ref = thread.posts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        post = _ref[_i];
        console.log(post);
        _results.push(article({
          "class": 'post',
          id: 'post-' + post.id
        }, function() {
          div({
            "class": 'meta'
          }, function() {
            span(post.id, {
              "class": 'post-id'
            });
            span(post.author, {
              "class": 'author'
            });
            return time(post.time, {
              datetime: post.time
            });
          });
          if (post.image) {
            div({
              "class": 'post-image'
            }, function() {
              return img({
                src: '',
                alt: ''
              });
            });
          }
          return div({
            "class": 'post-content'
          }, function() {
            return p(post.content);
          });
        }));
      }
      return _results;
    });
  }
}).call(this);
