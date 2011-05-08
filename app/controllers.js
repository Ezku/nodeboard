(function() {
  var __slice = Array.prototype.slice;
  module.exports = function(dependencies) {
    var accept, app, boardExists, collectBoard, collectThread, collector, config, filter, formidable, getBoardName, handleImageUpload, io, panels, receiveReply, receiveThread, renderPanels, service, services, socket, static, tap, validateBoard, validateThread;
    app = dependencies.app, config = dependencies.config, services = dependencies.services, formidable = dependencies.formidable, io = dependencies.io;
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
        validateBoard, function(req, res, next) {
          return service('Board').read(req.params, next, function(threads) {
            res[collector]('view', 'board');
            res[collector]('threads', threads);
            return next();
          });
        }
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
      return function(req, res, next) {
        var name, value;
        if (typeof params === 'object') {
          for (name in params) {
            value = params[name];
            res[collector](name, value);
          }
        } else {
          res.locals(collector);
        }
        return next();
      };
    };
    app.get('/', panels, static({
      title: 'Aaltoboard',
      id: "front-page",
      "class": ""
    }), static('overview', {
      view: 'index',
      title: 'Aaltoboard'
    }), renderPanels);
    app.get('/api/:board/', collectBoard('local'), function(req, res) {
      return res.send({
        board: req.params.board,
        threads: res.local('threads')
      });
    });
    app.get('/:board/', panels, collectBoard('overview'), function(req, res, next) {
      var board, boardTitle, name;
      board = req.params.board;
      name = getBoardName(board);
      boardTitle = "/" + board + "/ - " + name;
      res.overview('board', board);
      res.overview('title', boardTitle);
      res.locals({
        board: board,
        title: boardTitle,
        "class": "board-page",
        id: "board-page-" + board
      });
      return next();
    }, renderPanels);
    receiveThread = [
      validateBoard, handleImageUpload, accept('content', 'password'), filter(function(req, res) {
        var _ref;
        return service('Thread').create({
          thread: req.params,
          post: req.body,
          image: (_ref = req.files) != null ? _ref.image : void 0
        }).then(function(thread) {
          return res.thread = thread;
        });
      }), function(req, res, next) {
        var thread;
        thread = res.thread;
        socket.broadcast({
          thread: {
            board: thread.board,
            id: thread.id
          }
        });
        return next();
      }
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
    app.get('/:board/:id/', panels, collectBoard('overview'), collectThread('detail'), function(req, res, next) {
      var board, boardTitle, name, threadTitle;
      board = req.params.board;
      name = getBoardName(req.params.board);
      boardTitle = "/" + board + "/ - " + name;
      threadTitle = "/" + board + "/" + req.params.id;
      res.overview('board', board);
      res.overview('title', boardTitle);
      res.detail('title', threadTitle);
      res.locals({
        title: threadTitle,
        board: board,
        "class": "thread-page",
        id: "thread-page-" + req.params.id
      });
      return next();
    }, renderPanels);
    receiveReply = [
      validateBoard, handleImageUpload, validateThread, accept('content', 'password'), filter(function(req, res) {
        var _ref;
        return service('Thread').update({
          thread: req.params,
          post: req.body,
          image: (_ref = req.files) != null ? _ref.image : void 0
        }).then(function(thread) {
          return res.thread = thread;
        });
      }), function(req, res, next) {
        var thread;
        thread = res.thread;
        socket.broadcast({
          reply: {
            board: thread.board,
            thread: thread.id
          }
        });
        return next();
      }
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
    return socket.on('connection', function(client) {
      console.log('new client connection: ' + client.sessionId);
      client.on('message', function() {
        return console.log('message');
      });
      return client.on('disconnect', function() {
        return console.log('disconnect');
      });
    });
  };
}).call(this);
