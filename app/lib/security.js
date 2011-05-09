(function() {
  module.exports = function(dependencies) {
    var Tracker, config, countRecentUploads, enforceUniqueImage, findMatchingImage, hash, hashlib, imageHash, ipHash, preventFlood, promise, trackUpload;
    config = dependencies.config, hashlib = dependencies.hashlib;
    promise = dependencies.lib('promises').promise;
    Tracker = dependencies.mongoose.model('Tracker');
    hash = function(data, salt) {
      return hashlib.sha1(salt + data);
    };
    ipHash = function(req) {
      var _ref;
      return hash(req.connection.remoteAddress, ((_ref = req.params) != null ? _ref.board : void 0) != null);
    };
    imageHash = function(req) {
      return promise(function(success, error) {
        return hashlib.md5_file(req.files.image.path, function(result) {
          var _ref;
          if (result) {
            return success(hash(result, ((_ref = req.params) != null ? _ref.board : void 0) != null));
          } else {
            return error();
          }
        });
      });
    };
    countRecentUploads = function(ipHash) {
      return promise(function(success, error) {
        return Tracker.count({
          ipHash: ipHash,
          date: {
            $gt: Date.now() - config.security.floodwindow
          }
        }).run(function(err, count) {
          if (err) {
            return error(err);
          }
          return success(count);
        });
      });
    };
    findMatchingImage = function(imageHash) {
      return promise(function(success, error) {
        return Tracker.find({
          imageHash: imageHash
        }).limit(1).run(function(err, trackers) {
          if (err) {
            return error(err);
          }
          return success(trackers[0]);
        });
      });
    };
    preventFlood = function(req, res) {
      return promise(function(success, error) {
        if (!req.hash) {
          req.hash = {};
        }
        req.hash.ip = ipHash(req);
        return success();
      });
    };
    enforceUniqueImage = function(req, res) {
      return promise(function(success, error) {
        var _ref;
        if (!((_ref = req.files) != null ? _ref.image : void 0)) {
          return success();
        }
        if (!req.hash) {
          req.hash = {};
        }
        return imageHash(req).then(function(hash) {
          return req.hash.image = hash;
        });
      });
    };
    trackUpload = function(req, res) {
      return promise(function(success, error) {
        var tracker;
        tracker = new Tracker({
          board: req.params.board,
          thread: res.thread.id,
          post: res.thread.lastPost.id,
          date: res.thread.lastPost.date,
          ipHash: req.hash.ip,
          imageHash: req.hash.image
        });
        return tracker.save(function(err) {
          if (err) {
            return error(err);
          }
          return success(tracker);
        });
      });
    };
    return {
      preventFlood: preventFlood,
      enforceUniqueImage: enforceUniqueImage,
      trackUpload: trackUpload
    };
  };
}).call(this);
