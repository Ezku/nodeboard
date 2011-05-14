(function() {
  doctype(5);
  html(function() {
    head(function() {
      title(this.title);
      meta({
        charset: "utf-8"
      });
      link({
        rel: "stylesheet",
        href: '/stylesheets/style.css'
      });
      script({
        src: '/scripts/modernizr-1.7.min.js'
      });
      script({
        src: '/scripts/jquery-1.5.2.min.js'
      });
      script({
        src: 'http://ajax.aspnetcdn.com/ajax/jquery.templates/beta1/jquery.tmpl.min.js'
      });
      script({
        src: '/scripts/jquery.timeago.js'
      });
      script({
        src: '/socket.io/socket.io.js'
      });
      script({
        src: '/scripts/socket.io-channels-client.js'
      });
      return script({
        src: '/scripts/aaltoboard.js'
      });
    });
    return body({
      "class": this["class"],
      id: this.id
    }, function() {
      div({
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
        return div({
          id: "column-wrapper"
        }, function() {
          return this.body;
        });
      });
      script({
        type: 'text/x-jquery-tmpl',
        id: 'threadTemplate'
      }, function() {
        return text(this.partial("thread", {
          title: '/${board}/${id}',
          object: {
            id: '${id}'
          }
        }));
      });
      return script({
        type: 'text/x-jquery-tmpl',
        id: 'postTemplate'
      }, function() {
        return text(this.partial("partials/post", {
          jQtemplate: true,
          object: {
            id: '${id}',
            author: '${author}',
            date: '${date}',
            content: '${content}',
            image: {
              fullsize: '${image.fullsize}',
              thumbnail: '${image.thumbnail}'
            }
          }
        }));
      });
    });
  });
}).call(this);
