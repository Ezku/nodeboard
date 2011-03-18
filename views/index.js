(function() {
  h1(function() {
    return this.title;
  });
  p(function() {
    return "Welcome to {@title}";
  });
}).call(this);
