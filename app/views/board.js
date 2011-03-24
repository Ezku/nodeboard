(function() {
  h1(function() {
    return "Count: " + this.counter;
  });
  form({
    method: 'post',
    action: "/" + this.board + "/"
  }, function() {
    return dl(function() {
      dt(function() {
        return "Topic";
      });
      dd(function() {
        return input({
          name: 'topic',
          type: 'text'
        });
      });
      dt(function() {
        return "Content";
      });
      dd(function() {
        return textarea({
          name: 'content'
        });
      });
      dt(function() {
        return "Password";
      });
      dd(function() {
        return input({
          name: 'password',
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
