(function() {
  div({
    "class": 'columnHeader'
  }, function() {
    return h1(this.title);
  });
  div({
    "class": 'columnContent'
  }, function() {
    var boards, category, label, properties, _ref, _results;
    _ref = this.config.boards;
    _results = [];
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
      _results.push((function() {
        var _results2;
        _results2 = [];
        for (label in boards) {
          properties = boards[label];
          _results2.push(article({
            "class": "board " + category
          }, function() {
            return a({
              href: "/" + label + "/",
              title: properties.name
            }, function() {
              h3(label.toUpperCase());
              return p(properties.name);
            });
          }));
        }
        return _results2;
      })());
    }
    return _results;
  });
}).call(this);
