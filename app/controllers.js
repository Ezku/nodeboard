(function() {
  var __slice = Array.prototype.slice;
  module.exports = function(dependencies) {
    var accept, app, boardExists, collectBoard, collectThread, collector, config, detail, formidable, getBoardName, handleImageUpload, overview, renderPanels, service, services, validateBoard, validateThread;
    app = dependencies.app, config = dependencies.config, services = dependencies.services, formidable = dependencies.formidable;
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
    validateThread = function(req, res, next) {
      return service('Thread').read(req.params, next, function() {
        return next();
      });
    };
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
    collectBoard = function(collector) {
      return [
        validateBoard, function(req, res, next) {
          return service('Board').read(req.params, next, function(threads) {
            collector('view', 'board');
            collector('threads', threads);
            return next();
          });
        }
      ];
    };
    collectThread = function(collector) {
      return [
        validateThread, function(req, res, next) {
          return service('Thread').read(req.params, next, function(thread) {
            collector('view', 'thread');
            collector('thread', thread);
            return next();
          });
        }
      ];
    };
    collector = function() {
      var data;
      data = {};
      return function(key, value) {
        if (!(key != null)) {
          return data;
        }
        if (!(value != null)) {
          return data[key];
        }
        return data[key] = value;
      };
    };
    overview = collector();
    detail = collector();
    renderPanels = function(req, res, next) {
      return res.render('panels', {
        overview: overview(),
        detail: detail()
      });
    };
    app.get('/', function(req, res, next) {
      overview('view', 'index');
      overview('title', 'Aaltoboard');
      res.local('title', 'Aaltoboard');
      return next();
    }, renderPanels);
    app.get('/:board/', collectBoard(overview, function(req, res, next) {
      var board, boardTitle, name;
      board = req.params.board;
      name = getBoardName(board);
      boardTitle = "/" + board + "/ - " + name;
      overview('board', board);
      overview('title', boardTitle);
      res.local('title', boardTitle);
      return next();
    }), renderPanels);
    app.post('/:board/', validateBoard, handleImageUpload, accept('content', 'password'), function(req, res, next) {
      var _ref;
      return service('Thread').create({
        thread: req.params,
        post: req.body,
        image: (_ref = req.files) != null ? _ref.image : void 0
      }, next, function(thread) {
        return res.redirect("/" + req.params.board + "/" + (thread.toJSON().id) + "/");
      });
    });
    app.get('/:board/:id/', collectBoard(overview, collectThread(detail, function(req, res, next) {
      var board, boardTitle, name, threadTitle;
      board = req.params.board;
      name = getBoardName(req.params.board);
      boardTitle = "/" + board + "/ - " + name;
      threadTitle = "/" + board + "/" + req.params.id;
      overview('board', board);
      overview('title', boardTitle);
      detail('title', threadTitle);
      return res.local('title', threadTitle);
    })), renderPanels);
    return app.post('/:board/:id/', validateBoard, handleImageUpload, validateThread, accept('content', 'password'), function(req, res, next) {
      var _ref;
      return service('Thread').update({
        thread: req.params,
        post: req.body,
        image: (_ref = req.files) != null ? _ref.image : void 0
      }, next, function(thread) {
        return res.redirect('back');
      });
    });
  };
}).call(this);
