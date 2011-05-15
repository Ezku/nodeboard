(function() {
  module.exports = function(dependencies) {
    var NotFoundError, boards, filter, promise, service, services, shouldHaveBoard, shouldHaveThread, _ref;
    services = dependencies.services;
    _ref = dependencies.lib('promises'), promise = _ref.promise, filter = _ref.filter;
    service = services.get;
    boards = dependencies.lib('boards');
    NotFoundError = dependencies.lib('errors/NotFoundError');
    shouldHaveBoard = function(req, res, next) {
      var board;
      board = req.params.board;
      if ((board != null) && boards.exists(board)) {
        return next();
      } else {
        return next(new NotFoundError("Board '" + board + "' does not exist"));
      }
    };
    shouldHaveThread = filter(function(req) {
      return promise(function(success, error) {
        return service('Thread').read(req.params).then(success, function() {
          return error(new NotFoundError("Thread " + (Number(req.params.id)) + " does not exist"));
        });
      });
    });
    return {
      shouldHaveBoard: shouldHaveBoard,
      shouldHaveThread: shouldHaveThread
    };
  };
}).call(this);
