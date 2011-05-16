(function() {
  module.exports = function(dependencies) {
    var Tracker, ValidationError, config, countRecentUploads, enforceUniqueImage, findMatchingImage, hash, hashes, image, imageHash, ip, ipHash, past, preventFlood, promise, salt, succeed, trackUpload, _ref;
    config = dependencies.config;
    _ref = dependencies.lib('promises'), promise = _ref.promise, succeed = _ref.succeed;
    hashes = dependencies.lib('hashes');
    ValidationError = dependencies.lib('errors/ValidationError');
    Tracker = dependencies.mongoose.model('Tracker');
    ip = function(req) {
      return req.connection.remoteAddress;
    };
    salt = function(req) {
      var _ref2;
      return ((_ref2 = req.params) != null ? _ref2.board : void 0) != null;
    };
    image = function(req) {
      var _ref2, _ref3;
      return (_ref2 = req.files) != null ? (_ref3 = _ref2.image) != null ? _ref3.path : void 0 : void 0;
    };
    hash = function(data, salt) {
      return hashes.sha1(salt + data);
    };
    ipHash = function(req) {
      return hash(ip(req), salt(req));
    };
    imageHash = function(req) {
      return hashes.md5_file(image(req)).then(function(result) {
        return succeed(hash(result, salt(req)));
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
        var _ref2;
        if (!((_ref2 = req.files) != null ? _ref2.image : void 0) || !config.tracking.checkDuplicateImages) {
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
