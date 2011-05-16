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
    var PostService, PreconditionError, Thread, Tracker, ValidationError, hashlib, images, janitor, mongoose, promise, succeed, _ref;
    mongoose = dependencies.mongoose, hashlib = dependencies.hashlib;
    _ref = dependencies.lib('promises'), promise = _ref.promise, succeed = _ref.succeed;
    images = dependencies.lib('images');
    janitor = dependencies.lib('janitor');
    ValidationError = dependencies.lib('errors/ValidationError');
    PreconditionError = dependencies.lib('errors/PreconditionError');
    Thread = mongoose.model('Thread');
    Tracker = mongoose.model('Tracker');
    return PostService = (function() {
      __extends(PostService, AbstractService);
      function PostService() {
        PostService.__super__.constructor.apply(this, arguments);
      }
      PostService.prototype.remove = function(board, id, password) {
        return promise(function(success, error) {
          if (String(password != null ? password : '').length === 0) {
            return error(new PreconditionError("no password given"));
          }
          return Tracker.findOne({
            board: board,
            post: id
          }).run(function(err, tracker) {
            if (err) {
              return error(err);
            }
            if (!tracker) {
              return error(new PreconditionError("no such post"));
            }
            return Thread.findOne({
              markedForDeletion: false,
              id: tracker.thread
            }).run(function(err, thread) {
              var post, _ref2;
              if (err) {
                return error(err);
              }
              post = ((function() {
                var _i, _len, _ref2, _results;
                _ref2 = thread.posts;
                _results = [];
                for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                  post = _ref2[_i];
                  if (post.id = id) {
                    _results.push(post);
                  }
                }
                return _results;
              })())[0];
              if (!post) {
                return error(new PreconditionError("no such post"));
              }
              if (!post.password === hashlib.sha1(password)) {
                return error(new ValidationError("unable to delete post; password does not match"));
              }
              if (thread.id === post.id) {
                return janitor.sweepThread(thread).then(succeed(post));
              } else {
                images.deleteByPost(thread.board, post);
                tracker.remove();
                post.remove();
                if (((_ref2 = thread.lastPost) != null ? _ref2.id : void 0) === post.id) {
                  thread.lastPost.remove();
                }
                thread.save();
                return succeed(post);
              }
            });
          });
        });
      };
      return PostService;
    })();
  };
}).call(this);
