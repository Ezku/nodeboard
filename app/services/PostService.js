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
    var PostService, PreconditionError, Thread, Tracker, ValidationError, all, handle, hashes, images, janitor, mongoose, promise, removePost, removeThread, shouldHaveCorrespondingPost, shouldHavePassword, shouldHaveTracker, shouldMatchPassword, succeed, _, _ref;
    _ = dependencies._, mongoose = dependencies.mongoose;
    _ref = dependencies.lib('promises'), promise = _ref.promise, succeed = _ref.succeed, all = _ref.all;
    hashes = dependencies.lib('hashes');
    images = dependencies.lib('images');
    janitor = dependencies.lib('janitor');
    ValidationError = dependencies.lib('errors/ValidationError');
    PreconditionError = dependencies.lib('errors/PreconditionError');
    Thread = mongoose.model('Thread');
    Tracker = mongoose.model('Tracker');
    handle = function(result) {
      return function(err) {
        return promise(function(success, error) {
          if (err) {
            return error(err);
          }
          return success(result);
        });
      };
    };
    shouldHavePassword = function(password) {
      return promise(function(success, error) {
        if ((!(password != null)) || (String(password).length === 0)) {
          return error(new PreconditionError("no password given"));
        }
        return success();
      });
    };
    shouldHaveTracker = function(board, post) {
      return promise(function(success, error) {
        return Tracker.findOne({
          board: board,
          post: post
        }).run(function(err, tracker) {
          if (err) {
            return error(err);
          }
          if (!tracker) {
            return error(new PreconditionError("no such post"));
          }
          return success(tracker);
        });
      });
    };
    shouldHaveCorrespondingPost = function(board, thread, id) {
      return promise(function(success, error) {
        return Thread.findOne({
          markedForDeletion: false,
          board: board,
          id: thread
        }).run(function(err, thread) {
          var post;
          if (err) {
            return error(err);
          }
          post = _(thread.posts).find(function(post) {
            return Number(post.id) === id;
          });
          if (!post) {
            return error(new PreconditionError("no such post"));
          }
          return success({
            thread: thread,
            post: post
          });
        });
      });
    };
    shouldMatchPassword = function(post, password) {
      return promise(function(success, error) {
        if (!(String(post.password) === hashes.sha1(password))) {
          return error(new ValidationError("unable to delete post; password does not match"));
        }
        return success();
      });
    };
    removeThread = function(thread) {
      return janitor.sweepThread(thread);
    };
    removePost = function(thread, post, tracker) {
      return all([images.deleteByPost(thread.board, post), tracker.remove(handle()), post.remove(handle())]).then(function() {
        return promise(function(success, error) {
          var _ref2;
          if (Number((_ref2 = thread.lastPost) != null ? _ref2.id : void 0) === Number(post.id)) {
            thread.lastPost = null;
          }
          return thread.save(function(err) {
            if (err) {
              return error(err);
            }
            return success(post);
          });
        });
      });
    };
    return PostService = (function() {
      __extends(PostService, AbstractService);
      function PostService() {
        PostService.__super__.constructor.apply(this, arguments);
      }
      PostService.prototype.remove = function(board, id, password) {
        return promise(function(success, error) {
          return shouldHavePassword(password).then(function() {
            return shouldHaveTracker(board, id).then(function(tracker) {
              return shouldHaveCorrespondingPost(board, tracker.thread, id).then(function(_arg) {
                var post, thread;
                thread = _arg.thread, post = _arg.post;
                return shouldMatchPassword(post, password).then(function() {
                  if (Number(thread.id) === Number(post.id)) {
                    return removeThread(thread).then(function() {
                      return success(post);
                    });
                  } else {
                    return removePost(thread, post, tracker).then(function() {
                      return success(post);
                    });
                  }
                });
              });
            });
          });
        });
      };
      return PostService;
    })();
  };
}).call(this);
