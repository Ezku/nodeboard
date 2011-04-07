(function() {
  var AbstractService;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  AbstractService = require('./AbstractService.js');
  module.exports = function(dependencies) {
    var BoardService, Thread, mongoose;
    mongoose = dependencies.mongoose;
    Thread = mongoose.model('Thread');
    return BoardService = (function() {
      function BoardService() {
        BoardService.__super__.constructor.apply(this, arguments);
      }
      __extends(BoardService, AbstractService);
      BoardService.prototype.read = function(query, error, success) {
        return Thread.find({
          board: query.board
        }, [], function(err, result) {
          if (err) {
            return error(err);
          }
          return success(result);
        });
      };
      return BoardService;
    })();
  };
}).call(this);
