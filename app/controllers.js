(function() {
  var __slice = Array.prototype.slice;
  module.exports = function(dependencies) {
    var accept, app, boards, channel, channels, collectBoard, collectOverview, collectThread, collector, config, filter, formidable, handleImageUpload, io, janitor, panels, precondition, receivePost, receiveReply, receiveThread, renderPanels, service, services, socket, static, tap, tracking, validate;
    app = dependencies.app, config = dependencies.config, services = dependencies.services, formidable = dependencies.formidable, io = dependencies.io, channels = dependencies.channels;
    filter = dependencies.lib('promises').filter;
    boards = dependencies.lib('boards');
    service = services.get;
    precondition = function(condition) {
      return (dependencies.lib('preconditions'))[condition];
    };
    validate = function(validator) {
      return (dependencies.lib('validation'))[validator];
    };
    tracking = function(name) {
      return filter(function(req, res) {
        return dependencies.lib('tracking')[name](req, res);
      });
    };
    janitor = function(name) {
      return dependencies.lib('janitor')[name];
    };
    tap = function(f) {
      return function(req, res, next) {
        try {
          f(req, res);
          return next();
        } catch (e) {
          return next(e);
        }
      };
    };
    accept = function() {
      var params;
      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return tap(function(req, res) {
        var accepted, input, name, _i, _len, _ref;
        input = (_ref = req.body) != null ? _ref : {};
        accepted = {};
        for (_i = 0, _len = params.length; _i < _len; _i++) {
          name = params[_i];
          if (input[name] != null) {
            accepted[name] = input[name];
          }
        }
        return req.body = accepted;
      });
    };
    handleImageUpload = function(req, res, next) {
      var form;
      form = new formidable.IncomingForm();
      form.uploadDir = config.paths.temp;
      return form.parse(req, function(err, fields, files) {
        var file, name, _ref;
        if (err) {
          return next(err);
        }
        req.body = fields;
        req.files = {};
        for (name in files) {
          file = files[name];
          if ((_ref = file.type) != null ? _ref.match('^image') : void 0) {
            req.files[name] = file;
          }
        }
        return next();
      });
    };
    collector = function(name) {
      return tap(function(req, res) {
        var data;
        data = {};
        return res[name] = function(key, value) {
          if (!(key != null)) {
            return data;
          }
          if (!(value != null)) {
            return data[key];
          }
          return data[key] = value;
        };
      });
    };
    panels = [collector('overview'), collector('detail')];
    collectOverview = function(collector) {
      return [
        filter(function(req, res) {
          return service('Board').index().then(function(threads) {
            res[collector]('view', 'overview');
            return res[collector]('threads', threads);
          });
        })
      ];
    };
    collectBoard = function(collector) {
      return [
        precondition('shouldHaveBoard'), filter(function(req, res) {
          var query;
          query = {
            board: req.params.board,
            limit: req.query.limit,
            pages: req.query.pages
          };
          return service('Board').read(query).then(function(threads) {
            res[collector]('view', 'board');
            return res[collector]('threads', threads);
          });
        })
      ];
    };
    collectThread = function(collector) {
      return [
        precondition('shouldHaveThread'), filter(function(req, res) {
          return service('Thread').read(req.params).then(function(thread) {
            res[collector]('view', 'thread');
            return res[collector]('thread', thread);
          });
        })
      ];
    };
    renderPanels = function(req, res, next) {
      return res.render('panels', {
        overview: res.overview(),
        detail: res.detail()
      });
    };
    static = function(collector, params) {
      return tap(function(req, res) {
        var name, value, _results;
        if (typeof params === 'object') {
          _results = [];
          for (name in params) {
            value = params[name];
            _results.push(res[collector](name, value));
          }
          return _results;
        } else {
          return res.locals(collector);
        }
      });
    };
    app.get('/', panels, tap(function(req, res) {
      res.locals({
        title: 'Aaltoboard',
        id: "front-page",
        "class": ""
      });
      return res.overview('view', 'index');
    }), collectOverview('detail'), renderPanels);
    app.get('/api/', function(req, res) {
      var boards, data, group, id, result, _ref;
      result = {};
      _ref = config.boards;
      for (group in _ref) {
        boards = _ref[group];
        for (id in boards) {
          data = boards[id];
          result[id] = {
            name: data.name,
            url: "/api/" + id + "/",
            group: group
          };
        }
      }
      return res.send(result);
    });
    app.post('/api/:board/:id/delete/', precondition('shouldHaveBoard'), accept('password'), filter(function(req, res) {
      var _ref;
      return service('Post').remove(String(req.params.board), Number(req.params.id), (_ref = req.body) != null ? _ref.password : void 0);
    }), function(req, res) {
      return res.send({
        success: true
      });
    });
    app.get('/api/:board/', collectBoard('local'), function(req, res) {
      var threads;
      threads = res.local('threads');
      return res.send({
        board: req.params.board,
        total: threads.total,
        threads: threads
      });
    });
    app.get('/:board/', panels, collectBoard('overview'), tap(function(req, res) {
      var board, boardTitle, name, threads;
      board = req.params.board;
      name = boards.getName(board);
      boardTitle = "/" + board + "/ - " + name;
      res.overview('board', board);
      res.overview('title', boardTitle);
      threads = res.overview('threads');
      return res.locals({
        board: board,
        total: threads.total,
        pages: req.query.pages ? req.query.pages : 1,
        title: boardTitle,
        "class": "board-page",
        id: "board-page-" + board
      });
    }), renderPanels);
    receivePost = function(action) {
      return [
        accept('content', 'password'), tracking('preventFlood'), tracking('enforceUniqueImage'), filter(function(req, res) {
          var _ref;
          return service('Thread')[action]({
            thread: req.params,
            post: req.body,
            image: (_ref = req.files) != null ? _ref.image : void 0
          }).then(function(thread) {
            return res.thread = thread;
          });
        }), tracking('trackUpload')
      ];
    };
    receiveThread = [
      precondition('shouldHaveBoard'), handleImageUpload, validate('shouldHaveImage'), receivePost('create'), tap(function(req, res) {
        var thread;
        thread = res.thread;
        return channel.broadcastToChannel('newthread', thread.board, {
          thread: thread.id
        });
      }), tap(janitor('upkeep'))
    ];
    app.post('/api/:board/', receiveThread, function(req, res) {
      var thread;
      thread = res.thread;
      return res.send({
        board: req.params.board,
        id: thread.id,
        thread: thread
      });
    });
    app.post('/:board/', receiveThread, function(req, res) {
      var thread;
      thread = res.thread;
      return res.redirect("/" + req.params.board + "/" + (thread.toJSON().id) + "/");
    });
    app.get('/api/:board/:id', collectThread('local'), function(req, res) {
      return res.send({
        board: req.params.board,
        id: req.params.id,
        thread: res.local('thread')
      });
    });
    app.get('/:board/:id/', panels, collectBoard('overview'), collectThread('detail'), tap(function(req, res) {
      var board, boardTitle, name, threadTitle, threads;
      board = req.params.board;
      name = boards.getName(req.params.board);
      boardTitle = "/" + board + "/ - " + name;
      threadTitle = "/" + board + "/" + req.params.id + "/";
      res.overview('board', board);
      res.overview('title', boardTitle);
      res.detail('title', threadTitle);
      threads = res.overview('threads');
      return res.locals({
        title: threadTitle,
        board: board,
        total: threads.total,
        pages: req.query.pages ? req.query.pages : 1,
        "class": "thread-page",
        id: "thread-page-" + req.params.id
      });
    }), renderPanels);
    receiveReply = [
      precondition('shouldHaveBoard'), handleImageUpload, precondition('shouldHaveThread'), validate('shouldHaveImageOrContent'), receivePost('update'), tap(function(req, res) {
        var thread;
        thread = res.thread;
        return channel.broadcastToChannel('reply', thread.board, {
          thread: thread.id
        });
      })
    ];
    app.post('/api/:board/:id/', receiveReply, function(req, res) {
      return res.send({
        board: req.params.board,
        id: req.params.id,
        thread: res.thread
      });
    });
    app.post('/:board/:id/', receiveReply, function(req, res) {
      return res.redirect("/" + req.params.board + "/" + req.params.id + "/");
    });
    socket = io.listen(app);
    return channel = channels.listen(socket, {});
  };
}).call(this);
