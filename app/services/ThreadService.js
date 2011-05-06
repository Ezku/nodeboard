(function() {
  var AbstractService;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  AbstractService = require('./AbstractService.js');
  module.exports = function(dependencies) {
    var ImageProcessor, Post, Sequence, Thread, ThreadService, mongoose;
    mongoose = dependencies.mongoose;
    ImageProcessor = require('./thread/ImageProcessor.js')(dependencies);
    Sequence = mongoose.model('Sequence');
    Thread = mongoose.model('Thread');
    Post = mongoose.model('Post');
    return ThreadService = (function() {
      function ThreadService() {
        ThreadService.__super__.constructor.apply(this, arguments);
      }
      __extends(ThreadService, AbstractService);
      ThreadService.prototype.create = function(data, error, success) {
        return Sequence.next(data.thread.board, error, __bind(function(seq) {
          return this._processImage(data.image, data.thread.board, seq.counter, error, function(image) {
            var post, thread;
            thread = new Thread(data.thread);
            post = new Post(data.post).toJSON();
            post.image = image != null ? image.toJSON() : void 0;
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
        }, this));
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
            return error(new Error("thread not found"));
          }
          return success(threads[0]);
        });
      };
      ThreadService.prototype.update = function(data, error, success) {
        return Sequence.next(data.thread.board, error, __bind(function(seq) {
          return this._processImage(data.image, data.thread.board, seq.counter, error, function(image) {
            var post;
            post = new Post(data.post).toJSON();
            post.id = seq.counter;
            post.image = image != null ? image.toJSON() : void 0;
            return Thread.collection.findAndModify({
              board: String(data.thread.board),
              id: Number(data.thread.id)
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
        }, this));
      };
      ThreadService.prototype._processImage = function(image, board, id, error, success) {
        var processor;
        processor = new ImageProcessor(image, board, id);
        return processor.process(error, success);
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
