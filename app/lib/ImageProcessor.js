(function() {
  var fs, util;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  fs = require('fs');
  util = require('util');
  module.exports = function(dependencies) {
    var Image, ImageProcessor, config, imagemagick, mongoose, promise, _;
    _ = dependencies._, mongoose = dependencies.mongoose, imagemagick = dependencies.imagemagick, config = dependencies.config;
    promise = dependencies.lib('promises').promise;
    Image = mongoose.model('Image');
    return ImageProcessor = (function() {
      function ImageProcessor(data, board, id) {
        this.data = data;
        this.board = board;
        this.id = id;
        this.imagePath = this.getImagePath(this.board);
      }
      ImageProcessor.prototype.process = function() {
        return promise(__bind(function(success, error) {
          if (!this.data) {
            return success();
          }
          return imagemagick.identify(this.data.path, __bind(function(err, features) {
            var destinationPath, image, options;
            if (err) {
              return error(err);
            }
            if (_.indexOf(this.allowedImageTypes, features.format) === -1) {
              return error(new Error("image type " + features.format + " not allowed"));
            }
            image = this.getImageModel(features);
            options = this.getResizeOptions(image);
            destinationPath = this.imagePath + image.fullsize;
            return imagemagick.resize(options, __bind(function(err, stdout, stderr) {
              if (err) {
                return error(err);
              }
              return this.move(this.data.path, destinationPath).then((function() {
                return success(image);
              }), error);
            }, this));
          }, this));
        }, this));
      };
      ImageProcessor.prototype.getImageModel = function(features) {
        return new Image({
          name: this.data.name,
          width: features.width,
          height: features.height,
          fullsize: this.getFullsizeName(features.format),
          thumbnail: this.getThumbnailName(features.format)
        });
      };
      ImageProcessor.prototype.getResizeOptions = function(image) {
        var maxHeight, maxWidth, resizeOptions;
        resizeOptions = {
          srcPath: this.data.path,
          dstPath: this.imagePath + image.thumbnail
        };
        maxWidth = this.getThumbnailWidth();
        maxHeight = this.getThumbnailHeight();
        if (image.width > maxWidth) {
          resizeOptions.width = maxWidth;
        }
        if (image.height > maxHeight) {
          resizeOptions.height = maxHeight;
        }
        return resizeOptions;
      };
      ImageProcessor.prototype.getImagePath = function(board) {
        var path;
        path = config.paths.mount + board + "/";
        try {
          fs.statSync(path);
        } catch (e) {
          fs.mkdirSync(path, 0777);
        }
        return path;
      };
      ImageProcessor.prototype.getFullsizeName = function(format) {
        return "" + this.id + "." + (format.toLowerCase());
      };
      ImageProcessor.prototype.getThumbnailName = function(format) {
        return "" + this.id + ".thumb." + (format.toLowerCase());
      };
      ImageProcessor.prototype.getThumbnailHeight = function() {
        return config.images.thumbnail.height;
      };
      ImageProcessor.prototype.getThumbnailWidth = function() {
        return config.images.thumbnail.width;
      };
      ImageProcessor.prototype.move = function(source, destination) {
        return promise(function(success, error) {
          var input, output;
          input = fs.createReadStream(source);
          output = fs.createWriteStream(destination);
          return util.pump(input, output, function(err) {
            fs.unlinkSync(source);
            if (err) {
              return error(err);
            }
            return success();
          });
        });
      };
      ImageProcessor.prototype.allowedImageTypes = ['JPEG', 'GIF', 'PNG'];
      return ImageProcessor;
    })();
  };
}).call(this);
