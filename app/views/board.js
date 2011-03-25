(function() {
  form({
    method: 'post',
    action: "/" + this.board + "/"
  }, function() {
    return dl(function() {
      dt(function() {
        return label({
          "for": "topic"
        }, function() {
          return "Topic";
        });
      });
      dd(function() {
        return input({
          name: 'topic',
          id: 'topic',
          type: 'text'
        });
      });
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
}).call(this);
