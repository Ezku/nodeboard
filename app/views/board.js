(function() {
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
  section({
    "class": 'thread',
    id: 'thread-123123'
  }, function() {
    article({
      "class": 'post first',
      id: 'post-123123-1'
    }, function() {
      div({
        "class": 'post-image'
      }, function() {
        return img({
          src: '',
          alt: ''
        });
      });
      div({
        "class": 'meta'
      }, function() {
        span({
          "class": 'post-id'
        }, function() {
          return '123123-1';
        });
        span({
          "class": 'author'
        }, function() {
          return 'Anonymous';
        });
        return time({
          datetime: '2011-11-11 0:00:00+00:00'
        }, function() {
          return '13 minutes ago';
        });
      });
      return div({
        "class": 'post-content'
      }, function() {
        return p(function() {
          return 'text';
        });
      });
    });
    return article({
      "class": 'post',
      id: 'post-123123-2'
    }, function() {
      div({
        "class": 'meta'
      }, function() {
        span({
          "class": 'post-id'
        }, function() {
          return '123123-2';
        });
        span({
          "class": 'author'
        }, function() {
          return 'Anonymous';
        });
        return time({
          datetime: '2011-11-11 0:00:00+00:00'
        }, function() {
          return '13 minutes ago';
        });
      });
      div({
        "class": 'post-image'
      }, function() {
        return img({
          src: '',
          alt: ''
        });
      });
      return div({
        "class": 'post-content'
      }, function() {
        return p(function() {
          return 'text';
        });
      });
    });
  });
}).call(this);
