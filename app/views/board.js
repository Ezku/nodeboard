(function() {
  form({
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
  section(function() {
    return dl(function() {
      var index, thread, _i, _len, _ref, _results;
      index = 0;
      _ref = this.threads;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thread = _ref[_i];
        dt(++index);
        _results.push(dd(thread.toJSON()));
      }
      return _results;
    });
  });
}).call(this);
