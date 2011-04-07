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
      ThreadService.prototype.create = function(data, error, success) {
        return Sequence.next(data.thread.board, error, function(seq) {
          var thread;
          thread = new Thread(data.thread);
          thread.id = data.post.id = seq.counter;
          thread.firstPost = data.post;
          thread.posts.push(data.post);
          return thread.save(function(err) {
            if (err) {
              return error(err);
            }
            return success(thread);
          });
        });
      };
      /*
      read: (thread, success, error) ->
        Thread.find { board: thread.board, id: thread.id },
          ['board', 'id', 'posts'],
          (err, result) ->
            return error err if err
            success result

      update: (thread, success, error) ->
        post = thread.posts.last()

        Sequence.next
          error: error
          board: thread.board
          success: (seq) ->
            post.id = seq.counter
            Thread.collection.findAndModify { board: thread.board, id: thread.id },
                [],
                { $push: { posts: post }, lastPost: post },
                { new: false, upsert: false },
                (err, thread) ->
                  return error err if err
                  success thread

      delete: (thread, success, error) ->
        Thread.delete { board: thread.board, id: thread.id },
          [],
          (err, result) ->
            return error err if err
            success()
      */
      return ThreadService;
    })();
  };
}).call(this);
