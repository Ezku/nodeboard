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
        src: '/scripts/jquery.tmpl.min.js'
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
            ul(function() {
              var boards, group, _ref, _results;
              li({
                "class": "home"
              }, function() {
                return a({
                  href: "/"
                }, function() {
                  return "Aaltoboard";
                });
              });
              _ref = this.config.boards;
              _results = [];
              for (group in _ref) {
                boards = _ref[group];
                _results.push(ul({
                  "class": "board-group"
                }, function() {
                  var label, properties;
                  li({
                    "class": 'separator'
                  }, function() {
                    return '[';
                  });
                  for (label in boards) {
                    properties = boards[label];
                    li(function() {
                      return a({
                        href: "/" + label + "/",
                        title: properties.name
                      }, function() {
                        return label;
                      });
                    });
                  }
                  return li({
                    "class": 'separator'
                  }, function() {
                    return ']';
                  });
                }));
              }
              return _results;
            });
            return div({
              style: "clear: both;"
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
      script({
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
      return script({
        type: 'text/x-jquery-tmpl',
        id: 'boardThreadTemplate'
      }, function() {
        return text(this.partial("partials/thread", {
          jQtemplate: true,
          object: {
            id: '${id}',
            replyCount: '${replyCount-1}'
          }
        }));
      });
    });
  });
}).call(this);
