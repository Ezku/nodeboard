(function() {
  var AbstractService, fs, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  fs = require('fs');
  _ = require('underscore');
  AbstractService = require('./AbstractService.js');
  module.exports = function(dependencies) {
    var Image, Post, Sequence, Thread, ThreadService, config, imagemagick, mongoose;
    mongoose = dependencies.mongoose, imagemagick = dependencies.imagemagick, config = dependencies.config;
    Sequence = mongoose.model('Sequence');
    Thread = mongoose.model('Thread');
    Post = mongoose.model('Post');
    Image = mongoose.model('Image');
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
      ThreadService.prototype._processImage = function(data, board, id, error, success) {
        if (!data) {
          return success();
        }
        return imagemagick.identify(data.path, __bind(function(err, features) {
          var image, imagePath;
          if (err) {
            return error(err);
          }
          if (_.indexOf(this.allowedImageTypes, features.format) === -1) {
            return error(new Error("image type " + features.format + " not allowed"));
          }
          imagePath = this._getImagePath(board);
          image = this._getImageModel(data, features, id);
          return imagemagick.resize(this._getResizeOptions(imagePath, data, image), function(err, stdout, stderr) {
            if (err) {
              return error(err);
            }
            return fs.rename(data.path, imagePath + image.fullsize, function(err) {
              if (err) {
                return error(err);
              }
              return success(image);
            });
          });
        }, this));
      };
      ThreadService.prototype._getResizeOptions = function(imagePath, data, image) {
        var maxHeight, maxWidth, resizeOptions;
        resizeOptions = {
          srcPath: data.path,
          dstPath: imagePath + image.thumbnail
        };
        maxWidth = this._getThumbnailWidth();
        maxHeight = this._getThumbnailHeight();
        if (image.width > maxWidth) {
          resizeOptions.width = maxWidth;
        }
        if (image.height > maxHeight) {
          resizeOptions.height = maxHeight;
        }
        return resizeOptions;
      };
      ThreadService.prototype._getImageModel = function(data, features, id) {
        return new Image({
          name: data.name,
          width: features.width,
          height: features.height,
          fullsize: this._getFullsizeName(features.format, id),
          thumbnail: this._getThumbnailName(features.format, id)
        });
      };
      ThreadService.prototype._getImagePath = function(board) {
        var path;
        path = config.paths.mount + board + "/";
        try {
          fs.statSync(path);
        } catch (e) {
          fs.mkdirSync(path, 0777);
        }
        return path;
      };
      ThreadService.prototype._getFullsizeName = function(format, id) {
        return "" + id + "." + (format.toLowerCase());
      };
      ThreadService.prototype._getThumbnailName = function(format, id) {
        return "" + id + ".thumb." + (format.toLowerCase());
      };
      ThreadService.prototype._getThumbnailHeight = function() {
        return config.images.thumbnail.height;
      };
      ThreadService.prototype._getThumbnailWidth = function() {
        return config.images.thumbnail.width;
      };
      ThreadService.prototype.allowedImageTypes = ['JPEG', 'GIF', 'PNG'];
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
