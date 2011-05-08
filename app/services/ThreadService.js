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
    var ImageProcessor, Post, Sequence, Thread, ThreadService, mongoose, promise;
    mongoose = dependencies.mongoose;
    promise = dependencies.lib('promises').promise;
    ImageProcessor = dependencies.lib('ImageProcessor');
    Sequence = mongoose.model('Sequence');
    Thread = mongoose.model('Thread');
    Post = mongoose.model('Post');
    return ThreadService = (function() {
      function ThreadService() {
        ThreadService.__super__.constructor.apply(this, arguments);
      }
      __extends(ThreadService, AbstractService);
      ThreadService.prototype.read = function(query) {
        return promise(function(success, error) {
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
        });
      };
      ThreadService.prototype.create = function(data) {
        return Sequence.next(data.thread.board).then(__bind(function(seq) {
          return this._processImage(data.image, data.thread.board, seq.counter).then(function(image) {
            var post, thread;
            thread = new Thread(data.thread);
            post = new Post(data.post).toJSON();
            post.image = image != null ? image.toJSON() : void 0;
            thread.id = post.id = seq.counter;
            thread.posts.push(post);
            thread.firstPost = post;
            return promise(function(success, error) {
              return thread.save(function(err) {
                if (err) {
                  return error(err);
                }
                return success(thread);
              });
            });
          });
        }, this));
      };
      ThreadService.prototype.update = function(data) {
        return Sequence.next(data.thread.board).then(__bind(function(seq) {
          return this._processImage(data.image, data.thread.board, seq.counter).then(function(image) {
            var post;
            post = new Post(data.post).toJSON();
            post.id = seq.counter;
            post.image = image != null ? image.toJSON() : void 0;
            return Thread.addReply(data.thread.board, data.thread.id, post);
          });
        }, this));
      };
      ThreadService.prototype._processImage = function(image, board, id) {
        var processor;
        processor = new ImageProcessor(image, board, id);
        return processor.process();
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
