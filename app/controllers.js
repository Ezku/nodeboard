(function() {
  module.exports = function(dependencies) {
    var app, boardExists, config, getBoardName, service, services, validateBoard;
    app = dependencies.app, config = dependencies.config, services = dependencies.services;
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
    app.get('/', function(req, res) {
      return res.render('index', {
        title: 'Aaltoboard'
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
          title: "/" + board + "/ - " + name
        });
      });
    });
    return app.post('/:board/', validateBoard, function(req, res, next) {
      return service('Thread').create({
        thread: req.params,
        post: req.body
      }, next, function(result) {
        return res.send(result.toJSON());
      });
    });
  };
}).call(this);
