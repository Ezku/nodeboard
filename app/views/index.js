(function() {
  var label, properties, _ref;
  p("Welcome to " + this.title);
  _ref = this.config.boards.guilds;
  for (label in _ref) {
    properties = _ref[label];
    article({
      "class": "board"
    }, function() {
      return a({
        href: "/" + label + "/",
        title: properties.name
      }, function() {
        h2(label.toUpperCase());
        return p(properties.name);
      });
    });
  }
}).call(this);
