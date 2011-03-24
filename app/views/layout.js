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
      return div({
        id: "page-wrapper"
      }, function() {
        header(function() {
          return nav(function() {
            return ul(function() {
              var label, properties, _ref, _results;
              li(function() {
                return a({
                  href: "/"
                }, function() {
                  return "Aaltoboard";
                });
              });
              _ref = this.config.boards.guilds;
              _results = [];
              for (label in _ref) {
                properties = _ref[label];
                _results.push(li(function() {
                  return a({
                    href: "/" + label + "/",
                    title: properties.name
                  }, function() {
                    return label;
                  });
                }));
              }
              return _results;
            });
          });
        });
        div({
          id: "column-wrapper"
        }, function() {
          section({
            id: "high-level"
          }, function() {
            return div(function() {
              return this.body;
            });
          });
          return section({
            id: "detail"
          }, function() {
            return div(function() {
              return h1("Detail level goes here");
            });
          });
        });
        return footer(function() {
          return "Oh, and this would be the footer.";
        });
      });
    });
  });
}).call(this);
