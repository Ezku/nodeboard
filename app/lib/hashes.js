(function() {
  var crypto, fs;
  crypto = require('crypto');
  fs = require('fs');
  module.exports = function(dependencies) {
    var hash, md5, md5_file, promise, sha1;
    promise = dependencies.lib('promises').promise;
    hash = function(algorithm) {
      return function(string) {
        return crypto.createHash(algorithm).update(string).digest();
      };
    };
    sha1 = hash('sha1');
    md5 = hash('md5');
    md5_file = function(filename) {
      return promise(function(success, error) {
        return fs.readFile(filename, function(err, data) {
          if (err) {
            return error(err);
          }
          return success(md5(data));
        });
      });
    };
    return {
      sha1: sha1,
      md5_file: md5_file
    };
  };
}).call(this);
