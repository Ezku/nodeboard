(function() {
  doctype(5);
  html(function() {
    head(function() {
      title(this.title);
      return link({
        rel: stylesheet,
        href: '/stylesheets/style.css'
      });
    });
    return body(function() {
      return this.body;
    });
  });
}).call(this);
