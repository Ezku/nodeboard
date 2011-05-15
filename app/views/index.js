(function() {
  var boards, category, label, properties, _ref;
  h1(this.title);
  _ref = this.config.boards;
  for (category in _ref) {
    boards = _ref[category];
    h2(function() {
      switch (category) {
        case "tkk":
          return "TKK Guilds";
        case "aalto":
          return "The Aalto Trifecta";
        case "common":
          return "General discussion";
      }
    });
    for (label in boards) {
      properties = boards[label];
      article({
        "class": "board " + category
      }, function() {
        return a({
          href: "/" + label + "/",
          title: properties.name
        }, function() {
          h3(label.toUpperCase());
          return p(properties.name);
        });
      });
    }
  }
}).call(this);
