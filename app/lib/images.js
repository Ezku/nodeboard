(function() {
  var fs;
  fs = require('fs');
  module.exports = function(dependencies) {
    var config, deleteByPost, uploadPath;
    config = dependencies.config;
    uploadPath = function(board, filename) {
      return config.paths.mount + ("/" + board + "/") + filename;
    };
    deleteByPost = function(board, post) {
      var _ref, _ref2;
      if ((_ref = post.image) != null ? _ref.thumbnail : void 0) {
        fs.unlinkSync(uploadPath(board, post.image.thumbnail));
      }
      if ((_ref2 = post.image) != null ? _ref2.fullsize : void 0) {
        return fs.unlinkSync(uploadPath(board, post.image.fullsize));
      }
    };
    return {
      deleteByPost: deleteByPost
    };
  };
}).call(this);
