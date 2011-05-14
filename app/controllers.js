(function() {
  var __slice = Array.prototype.slice;
  module.exports = function(dependencies) {
    var accept, app, boardExists, channel, channels, collectBoard, collectThread, collector, config, filter, formidable, getBoardName, handleImageUpload, io, janitor, panels, receivePost, receiveReply, receiveThread, renderPanels, service, services, socket, static, tap, tracking, validateBoard, validateThread;
    app = dependencies.app, config = dependencies.config, services = dependencies.services, formidable = dependencies.formidable, io = dependencies.io, channels = dependencies.channels;
    tap = function(f) {
      return function(req, res, next) {
        f(req, res);
        return next();
      };
    };
    filter = dependencies.lib('promises').filter;
    service = services.get;
    boardExists = function(board) {
      var boards, group, _ref;
      _ref = config.boards;
      for (group in _ref) {
        boards = _ref[group];
        if (boards[board] != null) {
          return true;
        }
      }
      return false;
    };
    getBoardName = function(board) {
      var boards, group, _ref;
      _ref = config.boards;
      for (group in _ref) {
        boards = _ref[group];
        if (boards[board] != null) {
          return boards[board].name;
        }
      }
      return false;
    };
    validateBoard = function(req, res, next) {
      var board;
      board = req.params.board;
      if ((board != null) && boardExists(board)) {
        return next();
      } else {
        return next(new Error("Board '" + board + "' does not exist"));
      }
    };
    validateThread = filter(function(req) {
      return service('Thread').read(req.params);
    });
    accept = function() {
      var params;
      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return function(req, res, next) {
        var accepted, input, name, _i, _len;
        input = req.body;
        accepted = {};
        for (_i = 0, _len = params.length; _i < _len; _i++) {
          name = params[_i];
          accepted[name] = input[name];
        }
        req.body = accepted;
        return next();
      };
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
      return function(req, res, next) {
        var data;
        data = {};
        res[name] = function(key, value) {
          if (!(key != null)) {
            return data;
          }
          if (!(value != null)) {
            return data[key];
          }
          return data[key] = value;
        };
        return next();
      };
    };
    panels = [collector('overview'), collector('detail')];
    collectBoard = function(collector) {
      return [
        validateBoard, filter(function(req, res) {
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
        validateThread, filter(function(req, res) {
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
    tracking = function(name) {
      return filter(function(req, res) {
        return dependencies.lib('tracking')[name](req, res);
      });
    };
    janitor = function(name) {
      return dependencies.lib('janitor')[name];
    };
    app.get('/', panels, static({
      title: 'Aaltoboard',
      id: "front-page",
      "class": ""
    }), static('overview', {
      view: 'index',
      title: 'Aaltoboard'
    }), renderPanels);
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
    app.get('/api/:board/', collectBoard('local'), function(req, res) {
      return res.send({
        board: req.params.board,
        threads: res.local('threads')
      });
    });
    app.get('/:board/', panels, collectBoard('overview'), tap(function(req, res) {
      var board, boardTitle, name;
      board = req.params.board;
      name = getBoardName(board);
      boardTitle = "/" + board + "/ - " + name;
      res.overview('board', board);
      res.overview('title', boardTitle);
      return res.locals({
        board: board,
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
      validateBoard, handleImageUpload, receivePost('create'), tap(function(req, res) {
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
      var board, boardTitle, name, threadTitle;
      board = req.params.board;
      name = getBoardName(req.params.board);
      boardTitle = "/" + board + "/ - " + name;
      threadTitle = "/" + board + "/" + req.params.id;
      res.overview('board', board);
      res.overview('title', boardTitle);
      res.detail('title', threadTitle);
      return res.locals({
        title: threadTitle,
        board: board,
        "class": "thread-page",
        id: "thread-page-" + req.params.id
      });
    }), renderPanels);
    receiveReply = [
      validateBoard, handleImageUpload, validateThread, receivePost('update'), tap(function(req, res) {
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
