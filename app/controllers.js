(function() {
  module.exports = function(dependencies) {
    var Board, Post, Thread, app, boardExists, config, getBoardName, mockupThreads, models, post, thread, validateBoard;
    app = dependencies.app, models = dependencies.models, config = dependencies.config, models = dependencies.models;
    Thread = models.Thread, Post = models.Post;
    Board = dependencies.services.Board;
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
    post = {
      id: 12345,
      author: 'Anonymous',
      time: '2011-11-11 0:00:00+00:00',
      content: 'Trolol'
    };
    thread = {
      id: 54321,
      replycount: 13,
      firstpost: post,
      lastpost: post,
      posts: [post, post]
    };
    mockupThreads = [thread, thread, thread];
    app.get('/:board/', validateBoard, function(req, res, next) {
      var board, boardService, name;
      board = req.params.board;
      name = getBoardName(board);
      boardService = new Board;
      return boardService.read(board, function(threads) {
        return res.render('board', {
          board: board,
          threads: mockupThreads,
          title: "/" + board + "/ - " + name
        });
      }, function(err) {
        return next(err);
      });
    });
    return app.post('/:board/', validateBoard, function(req, res, next) {
      thread = new Thread({
        board: req.params.board
      });
      thread.posts.add(new Post({
        content: req.body.content,
        password: req.body.password
      }));
      return thread.save({}, {
        error: next,
        success: function(thread) {
          return res.send(thread.toJSON());
        }
      });
    });
  };
}).call(this);
