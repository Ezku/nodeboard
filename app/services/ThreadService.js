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
    var Post, Sequence, Thread, ThreadService, mongoose;
    mongoose = dependencies.mongoose;
    Sequence = mongoose.model('Sequence');
    Thread = mongoose.model('Thread');
    Post = mongoose.model('Post');
    return ThreadService = (function() {
      function ThreadService() {
        ThreadService.__super__.constructor.apply(this, arguments);
      }
      __extends(ThreadService, AbstractService);
      ThreadService.prototype.create = function(data, error, success) {
        return Sequence.next(data.thread.board, error, function(seq) {
          var post, thread;
          thread = new Thread(data.thread);
          post = new Post(data.post).toJSON();
          thread.id = post.id = seq.counter;
          thread.posts.push(post);
          thread.firstPost = post;
          return thread.save(function(err) {
            if (err) {
              return error(err);
            }
            return success(thread);
          });
        });
      };
      ThreadService.prototype.read = function(query, error, success) {
        return Thread.find({
          board: String(query.board),
          id: Number(query.id)
        }).select('board', 'id', 'posts').limit(1).run(function(err, threads) {
          if (err) {
            return error(err);
          }
          if (!threads[0]) {
            return error("thread not found");
          }
          return success(threads[0]);
        });
      };
      ThreadService.prototype.update = function(data, error, success) {
        return Sequence.next(data.board, error, function(seq) {
          var post;
          post = new Post(data.post).toJSON();
          post.id = seq.counter;
          return Thread.collection.findAndModify({
            board: String(data.board),
            id: Number(data.id)
          }, [], {
            $push: {
              posts: post
            },
            $set: {
              lastPost: post
            },
            $inc: {
              replyCount: 1
            }
          }, {
            "new": false,
            upsert: false
          }, function(err, thread) {
            if (err) {
              return error(err);
            }
            return success(thread);
          });
        });
      };
      /*
      delete: (thread, error, success) ->
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
