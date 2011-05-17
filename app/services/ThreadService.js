(function() {
  var AbstractService, fs;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  fs = require('fs');
  AbstractService = require('./AbstractService.js');
  module.exports = function(dependencies) {
    var ImageProcessor, NotFoundError, Post, Sequence, Thread, ThreadService, hashes, mongoose, promise;
    mongoose = dependencies.mongoose;
    promise = dependencies.lib('promises').promise;
    NotFoundError = dependencies.lib('errors/NotFoundError');
    ImageProcessor = dependencies.lib('ImageProcessor');
    hashes = dependencies.lib('hashes');
    Sequence = mongoose.model('Sequence');
    Thread = mongoose.model('Thread');
    Post = mongoose.model('Post');
    return ThreadService = (function() {
      __extends(ThreadService, AbstractService);
      function ThreadService() {
        ThreadService.__super__.constructor.apply(this, arguments);
      }
      ThreadService.prototype.read = function(query) {
        return promise(function(success, error) {
          return Thread.find({
            board: String(query.board),
            id: Number(query.id),
            markedForDeletion: false
          }).exclude('firstPost', 'lastPost', 'posts.password').limit(1).run(function(err, threads) {
            var post, thread, _i, _len, _ref;
            if (err) {
              return error(err);
            }
            if (!threads[0]) {
              return error(new NotFoundError("thread not found"));
            }
            thread = threads[0];
            _ref = thread.posts;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              post = _ref[_i];
              post.board = thread.board;
            }
            return success(threads[0]);
          });
        });
      };
      ThreadService.prototype.create = function(data) {
        return Sequence.next(data.thread.board).then(__bind(function(seq) {
          return this._processImage(data.image, data.thread.board, seq.counter).then(__bind(function(image) {
            var post, thread;
            post = this._post(data.post, seq.counter, image);
            thread = this._thread(data.thread, post);
            return promise(__bind(function(success, error) {
              return thread.save(__bind(function(err) {
                if (err) {
                  this._revert(data.thread.board, post);
                  return error(err);
                }
                return success(thread);
              }, this));
            }, this));
          }, this));
        }, this));
      };
      ThreadService.prototype.update = function(data) {
        return Sequence.next(data.thread.board).then(__bind(function(seq) {
          return this._processImage(data.image, data.thread.board, seq.counter).then(__bind(function(image) {
            var post;
            post = this._post(data.post, seq.counter, image);
            return promise(__bind(function(success, error) {
              return Thread.addReply(data.thread.board, data.thread.id, post).then(function(thread) {
                thread.lastPost = post;
                return success(thread);
              }, __bind(function(err) {
                this._revert(data.thread.board, post);
                return error(err);
              }, this));
            }, this));
          }, this));
        }, this));
      };
      ThreadService.prototype._processImage = function(image, board, id) {
        var processor;
        processor = new ImageProcessor(image, board, id);
        return processor.process();
      };
      ThreadService.prototype._post = function(data, id, image) {
        data.id = id;
        data.image = image != null ? image.toJSON() : void 0;
        data.password = (data.password != null) && String(data.password).length > 0 ? hashes.sha1(data.password) : null;
        return new Post(data).toJSON();
      };
      ThreadService.prototype._thread = function(data, post) {
        var thread;
        data.id = post.id;
        data.updated = post.date;
        data.firstPost = post;
        thread = new Thread(data);
        thread.posts.push(post);
        return thread;
      };
      ThreadService.prototype._revert = function(board, post) {
        var _ref, _ref2;
        fs.unlinkSync(config.paths.mount + ("/" + board + "/") + ((_ref = post.image) != null ? _ref.thumbnail : void 0));
        return fs.unlinkSync(config.paths.mount + ("/" + board + "/") + ((_ref2 = post.image) != null ? _ref2.fullsize : void 0));
      };
      return ThreadService;
    })();
  };
}).call(this);
