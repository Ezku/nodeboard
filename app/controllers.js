(function() {
  module.exports = function(dependencies) {
    var app, config, hasBoard, mongoose;
    app = dependencies.app, mongoose = dependencies.mongoose, config = dependencies.config;
    hasBoard = function(board) {
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
    app.get('/', function(req, res) {
      return res.render('index', {
        title: 'Aaltoboard'
      });
    });
    return app.get('/:board/', function(req, res, next) {
      if (!hasBoard(req.params.board)) {
        return next();
      }
      return res.render('board', {
        board: req.params.board
      });
    });
  };
}).call(this);
