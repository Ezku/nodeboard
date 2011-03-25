(function() {
  module.exports = function(dependencies) {
    var Sequence, Thread, app, boardExists, config, getBoardName, mongoose, validateBoard;
    app = dependencies.app, mongoose = dependencies.mongoose, config = dependencies.config;
    Sequence = mongoose.model('Sequence');
    Thread = mongoose.model('Thread');
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
    app.get('/', function(req, res) {
      return res.render('index', {
        title: 'Aaltoboard'
      });
    });
    app.get('/:board/', validateBoard, function(req, res, next) {
      var board, name;
      board = req.params.board;
      name = getBoardName(board);
      return res.render('board', {
        board: board,
        title: "/" + board + "/ - " + name
      });
    });
    return app.post('/:board/', validateBoard, function(req, res, next) {
      return Thread.create({
        thread: {
          board: req.params.board,
          topic: req.body.topic
        },
        post: {
          content: req.body.content,
          password: req.body.password
        },
        error: next,
        success: function(thread) {
          return res.send(thread);
        }
      });
    });
  };
}).call(this);
