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
              li(function() {
                return a({
                  href: "."
                }, function() {
                  return "Aaltoboard";
                });
              });
              li(function() {
                return a({
                  href: "ak/"
                }, function() {
                  return "/ak/";
                });
              });
              li(function() {
                return a({
                  href: "as/"
                }, function() {
                  return "/as/";
                });
              });
              li(function() {
                return a({
                  href: "bio/"
                }, function() {
                  return "/bio/";
                });
              });
              li(function() {
                return a({
                  href: "fk/"
                }, function() {
                  return "/fk/";
                });
              });
              li(function() {
                return a({
                  href: "ik/"
                }, function() {
                  return "/ik/";
                });
              });
              li(function() {
                return a({
                  href: "inf/"
                }, function() {
                  return "/inf/";
                });
              });
              li(function() {
                return a({
                  href: "kik/"
                }, function() {
                  return "/kik/";
                });
              });
              li(function() {
                return a({
                  href: "kk/"
                }, function() {
                  return "/kk/";
                });
              });
              li(function() {
                return a({
                  href: "pjk/"
                }, function() {
                  return "/pjk/";
                });
              });
              li(function() {
                return a({
                  href: "tik/"
                }, function() {
                  return "/tik/";
                });
              });
              return li(function() {
                return a({
                  href: "vk/"
                }, function() {
                  return "/vk/";
                });
              });
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
