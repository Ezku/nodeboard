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
    var BoardService, Thread, config, mongoose, promise;
    mongoose = dependencies.mongoose, config = dependencies.config;
    promise = dependencies.lib('promises').promise;
    Thread = mongoose.model('Thread');
    return BoardService = (function() {
      __extends(BoardService, AbstractService);
      function BoardService() {
        BoardService.__super__.constructor.apply(this, arguments);
      }
      BoardService.prototype.index = function() {
        return promise(function(success, error) {
          return Thread.find({
            markedForDeletion: false
          }).exclude('posts', 'firstPost.password', 'lastPost.password').sort('updated', -1).limit(config.content.threadsPerPage).run(function(err, threads) {
            if (err) {
              return error(err);
            }
            return success(threads);
          });
        });
      };
      BoardService.prototype.read = function(query) {
        return promise(function(success, error) {
          var limit, _ref, _ref2;
          limit = (_ref = query.limit) != null ? _ref : ((_ref2 = query.pages) != null ? _ref2 : 1) * config.content.threadsPerPage;
          return Thread.find({
            board: query.board,
            markedForDeletion: false
          }).exclude('posts', 'firstPost.password', 'lastPost.password').sort('updated', -1).limit(limit).run(function(err, threads) {
            if (err) {
              return error(err);
            }
            return Thread.count({
              board: query.board,
              markedForDeletion: false
            }).run(function(err, count) {
              if (err) {
                return error(err);
              }
              threads.total = count;
              return success(threads);
            });
          });
        });
      };
      return BoardService;
    })();
  };
}).call(this);
