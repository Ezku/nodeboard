(function() {
  var fs;
  fs = require('fs');
  module.exports = function(dependencies) {
    var all, config, deleteByPost, promise, uploadPath, _ref;
    config = dependencies.config;
    _ref = dependencies.lib('promises'), promise = _ref.promise, all = _ref.all;
    uploadPath = function(board, filename) {
      return config.paths.mount + ("/" + board + "/") + filename;
    };
    deleteByPost = function(board, post) {
      var unlink, _ref2, _ref3;
      unlink = function(filename) {
        return promise(function(success, error) {
          var path;
          path = uploadPath(board, filename);
          return fs.stat(path, function(err, stat) {
            if (err) {
              return error(err);
            }
            if (!stat.isFile()) {
              return success();
            }
            return fs.unlink(path, function(err) {
              if (err) {
                return error(err);
              }
              return success();
            });
          });
        });
      };
      return all([((_ref2 = post.image) != null ? _ref2.thumbnail : void 0) ? unlink(post.image.thumbnail) : void 0, ((_ref3 = post.image) != null ? _ref3.fullsize : void 0) ? unlink(post.image.fullsize) : void 0]);
    };
    return {
      deleteByPost: deleteByPost
    };
  };
}).call(this);
