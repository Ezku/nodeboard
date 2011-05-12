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
    var BoardService, Thread, mongoose, promise;
    mongoose = dependencies.mongoose;
    promise = dependencies.lib('promises').promise;
    Thread = mongoose.model('Thread');
    return BoardService = (function() {
      __extends(BoardService, AbstractService);
      function BoardService() {
        BoardService.__super__.constructor.apply(this, arguments);
      }
      BoardService.prototype.read = function(query) {
        return promise(function(success, error) {
          return Thread.find({
            board: query.board
          }).select('board', 'id', 'firstPost', 'lastPost', 'replyCount').sort('id', -1).run(function(err, threads) {
            if (err) {
              return error(err);
            }
            return success(threads);
          });
        });
      };
      return BoardService;
    })();
  };
}).call(this);
