(function() {
  module.exports = function(dependencies) {
    var Sequence, app, boardExists, boardMustExist, config, mongoose;
    app = dependencies.app, mongoose = dependencies.mongoose, config = dependencies.config;
    Sequence = mongoose.model('Sequence');
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
    boardMustExist = function(req, res, next) {
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
    return app.get('/:board/', boardMustExist, function(req, res, next) {
      return Sequence.next(req.params.board, function(error, seq) {
        if (error) {
          return next(error);
        }
        return res.render('board', {
          board: req.params.board,
          counter: seq.counter
        });
      });
    });
  };
}).call(this);
