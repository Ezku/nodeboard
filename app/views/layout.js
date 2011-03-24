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
                  return "AK";
                });
              });
              li(function() {
                return a({
                  href: "as/"
                }, function() {
                  return "AS";
                });
              });
              li(function() {
                return a({
                  href: "bio/"
                }, function() {
                  return "BIO";
                });
              });
              li(function() {
                return a({
                  href: "fk/"
                }, function() {
                  return "FK";
                });
              });
              li(function() {
                return a({
                  href: "ik/"
                }, function() {
                  return "IK";
                });
              });
              li(function() {
                return a({
                  href: "inf/"
                }, function() {
                  return "INF";
                });
              });
              li(function() {
                return a({
                  href: "kik/"
                }, function() {
                  return "KIK";
                });
              });
              li(function() {
                return a({
                  href: "kk/"
                }, function() {
                  return "KK";
                });
              });
              li(function() {
                return a({
                  href: "pjk/"
                }, function() {
                  return "PJK";
                });
              });
              li(function() {
                return a({
                  href: "tik/"
                }, function() {
                  return "TIK";
                });
              });
              return li(function() {
                return a({
                  href: "vk/"
                }, function() {
                  return "VK";
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
