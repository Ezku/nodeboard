(function() {
  module.exports = function(dependencies) {
    var Tracker, ValidationError, config, countRecentUploads, enforceUniqueImage, findMatchingImage, hash, hashlib, image, imageHash, ip, ipHash, past, preventFlood, promise, salt, trackUpload;
    config = dependencies.config, hashlib = dependencies.hashlib;
    promise = dependencies.lib('promises').promise;
    ValidationError = dependencies.lib('errors/ValidationError');
    Tracker = dependencies.mongoose.model('Tracker');
    ip = function(req) {
      return req.connection.remoteAddress;
    };
    salt = function(req) {
      var _ref;
      return ((_ref = req.params) != null ? _ref.board : void 0) != null;
    };
    image = function(req) {
      var _ref, _ref2;
      return (_ref = req.files) != null ? (_ref2 = _ref.image) != null ? _ref2.path : void 0 : void 0;
    };
    hash = function(data, salt) {
      return hashlib.sha1(salt + data);
    };
    ipHash = function(req) {
      return hash(ip(req), salt(req));
    };
    imageHash = function(req) {
      return promise(function(success, error) {
        setTimeout(function() {
          return error(new Error("could not hash image file: operation timed out"));
        }, config.tracking.imageHashTimeout * 1000);
        return hashlib.md5_file(image(req), function(result) {
          if (result) {
            return success(hash(result, salt(req)));
          } else {
            return error(new Error("could not hash image file"));
          }
        });
      });
    };
    past = function(seconds) {
      return {
        $gt: new Date(Date.now() - seconds * 1000)
      };
    };
    countRecentUploads = function(board, ipHash) {
      return promise(function(success, error) {
        return Tracker.count({
          board: board,
          ipHash: ipHash,
          date: past(config.tracking.floodWindow)
        }).run(function(err, count) {
          if (err) {
            return error(err);
          }
          return success(count);
        });
      });
    };
    findMatchingImage = function(board, imageHash) {
      return promise(function(success, error) {
        return Tracker.find({
          board: board,
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
      if (!req.hash) {
        req.hash = {};
      }
      req.hash.ip = ipHash(req);
      return countRecentUploads(req.params.board, req.hash.ip).then(function(count) {
        return promise(function(success, error) {
          if (count < config.tracking.minCurtailRate) {
            return success();
          } else if (count < config.tracking.maxPostRate) {
            return setTimeout(success, count * 1000);
          } else {
            return error(new ValidationError("flood detected; please wait before posting"));
          }
        });
      });
    };
    enforceUniqueImage = function(req, res) {
      return promise(function(success, error) {
        var _ref;
        if (!((_ref = req.files) != null ? _ref.image : void 0) || !config.tracking.checkDuplicateImages) {
          return success();
        }
        if (!req.hash) {
          req.hash = {};
        }
        return imageHash(req).then(function(hash) {
          req.hash.image = hash;
          return findMatchingImage(req.params.board, hash).then(function(tracker) {
            return promise(function(success, error) {
              if (!tracker) {
                return success();
              }
              return error(new ValidationError("duplicate image detected"));
            });
          });
        });
      });
    };
    trackUpload = function(req, res) {
      return promise(function(success, error) {
        var post, tracker;
        post = res.thread.lastPost || res.thread.firstPost;
        tracker = new Tracker({
          board: req.params.board,
          thread: res.thread.id,
          post: post.id,
          date: post.date,
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
