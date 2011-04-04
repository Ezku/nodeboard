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
    var Sequence, Thread, ThreadService, mongoose;
    mongoose = dependencies.mongoose;
    Thread = mongoose.model('Thread');
    Sequence = mongoose.model('Sequence');
    return ThreadService = (function() {
      function ThreadService() {
        ThreadService.__super__.constructor.apply(this, arguments);
      }
      __extends(ThreadService, AbstractService);
      ThreadService.prototype.create = function(thread, success, error) {
        var post;
        post = thread.posts.first();
        return Sequence.next({
          error: error,
          board: thread.board,
          success: function(seq) {
            var result;
            result = new Thread(thread);
            result.id = result.latestPost = post.id = seq.counter;
            result.posts.push(post);
            return result.save(function(err) {
              if (err) {
                return error(err);
              }
              return success(result);
            });
          }
        });
      };
      ThreadService.prototype.read = function(thread, success, error) {
        return Thread.find({
          board: thread.board,
          id: thread.id
        }, [], function(err, result) {
          if (err) {
            return error(err);
          }
          return success(result);
        });
      };
      ThreadService.prototype.update = function(thread, success, error) {
        var post;
        post = thread.posts.last();
        return Sequence.next({
          error: error,
          board: thread.board,
          success: function(seq) {
            post.id = seq.counter;
            return Thread.collection.findAndModify({
              board: thread.board,
              id: thread.id
            }, [], {
              $push: {
                posts: post
              },
              latestPost: seq.counter
            }, {
              "new": false,
              upsert: false
            }, function(err, thread) {
              if (err) {
                return error(err);
              }
              return success(thread);
            });
          }
        });
      };
      ThreadService.prototype["delete"] = function(thread, success, error) {
        return Thread["delete"]({
          board: thread.board,
          id: thread.id
        }, [], function(err, result) {
          if (err) {
            return error(err);
          }
          return success();
        });
      };
      return ThreadService;
    })();
  };
}).call(this);
