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
    var PostService, PreconditionError, Thread, Tracker, ValidationError, all, handle, hashes, images, janitor, mongoose, promise, succeed, _, _ref;
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
    return PostService = (function() {
      __extends(PostService, AbstractService);
      function PostService() {
        PostService.__super__.constructor.apply(this, arguments);
      }
      PostService.prototype.remove = function(board, id, password) {
        return promise(function(success, error) {
          if ((!(password != null)) || (String(password).length === 0)) {
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
              post = _(thread.posts).find(function(post) {
                return Number(post.id) === id;
              });
              if (!post) {
                return error(new PreconditionError("no such post"));
              }
              if (!(String(post.password) === hashes.sha1(password))) {
                return error(new ValidationError("unable to delete post; password does not match"));
              }
              if (Number(thread.id) === Number(post.id)) {
                return janitor.sweepThread(thread).then(function() {
                  return success(post);
                });
              } else {
                return all([images.deleteByPost(thread.board, post), tracker.remove(handle()), post.remove(handle()), ((_ref2 = thread.lastPost) != null ? _ref2.id : void 0) === post.id ? thread.lastPost.remove(handle()) : void 0]).then(function() {
                  return thread.save(function(err) {
                    if (err) {
                      return error(err);
                    }
                    return success(post);
                  });
                }, error);
              }
            });
          });
        });
      };
      return PostService;
    })();
  };
}).call(this);
