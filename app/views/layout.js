(function() {
  doctype(5);
  html(function() {
    head(function() {
      title(this.title);
      meta({
        charset: "utf8"
      });
      link({
        rel: "stylesheet",
        href: '/stylesheets/style.css'
      });
      script({
        src: '/scripts/modernizr-1.7.min.js'
      });
      return script({
        src: '/scripts/browserify.js'
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
          div({
            id: "high-level"
          }, function() {
            h1(this.title);
            return div(function() {
              return this.body;
            });
          });
          return div({
            id: "detail"
          }, function() {
            h1("Detail level goes here");
            return div(function() {
              return "The content is vastly abundant.";
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
