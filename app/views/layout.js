(function() {
  doctype(5);
  html(function() {
    head(function() {
      title(this.title);
      link({
        rel: "stylesheet",
        href: '/stylesheets/style.css'
      });
      return script({
        src: '/scripts/modernizr-1.7.min.js'
      });
    });
    return body(function() {
      return this.body;
    });
  });
}).call(this);
