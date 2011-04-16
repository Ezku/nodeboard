(function() {
  module.exports = function(dependencies) {
    var app, boardExists, config, formidable, getBoardName, handleImageUpload, io, service, services, socket, validateBoard, validateThread;
    app = dependencies.app, config = dependencies.config, services = dependencies.services, formidable = dependencies.formidable, io = dependencies.io;
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
    app.get('/', function(req, res) {
      return res.render('index', {
        title: 'Aaltoboard',
        id: "front-page",
        "class": ""
      });
    });
    app.get('/:board/', validateBoard, function(req, res, next) {
      var board, name;
      board = req.params.board;
      name = getBoardName(board);
      return service('Board').read(req.params, next, function(threads) {
        return res.render('board', {
          board: board,
          threads: threads,
          title: "/" + board + "/ - " + name,
          "class": "board-page",
          id: "board-page-" + board
        });
      });
    });
    app.post('/:board/', validateBoard, handleImageUpload, function(req, res, next) {
      var _ref;
      return service('Thread').create({
        thread: req.params,
        post: req.body,
        image: (_ref = req.files) != null ? _ref.image : void 0
      }, next, function(thread) {
        socket.broadcast({
          thread: {
            board: thread.board,
            id: thread.id
          }
        });
        return res.redirect("/" + req.params.board + "/" + (thread.toJSON().id) + "/");
      });
    });
    app.get('/:board/:id/', validateBoard, function(req, res, next) {
      return service('Thread').read(req.params, next, function(thread) {
        return service('Board').read(req.params, next, function(threads) {
          return res.render('board', {
            board: req.params.board,
            threads: threads,
            title: "/" + req.params.board + "/ - " + (getBoardName(req.params.board)),
            "class": "thread-page",
            id: "thread-page-" + req.params.id,
            detailLevel: "thread",
            detailTitle: "/" + req.params.board + "/" + req.params.id,
            detailData: thread.toJSON()
          });
        });
      });
    });
    app.post('/:board/:id/', validateBoard, handleImageUpload, validateThread, function(req, res, next) {
      var _ref;
      return service('Thread').update({
        thread: req.params,
        post: req.body,
        image: (_ref = req.files) != null ? _ref.image : void 0
      }, next, function(thread) {
        socket.broadcast({
          reply: {
            board: thread.board,
            thread: thread.id
          }
        });
        return res.redirect('back');
      });
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
