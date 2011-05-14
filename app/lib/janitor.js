(function() {
  module.exports = function(dependencies) {
    var Thread, Tracker, checkOrphanedTrackers, config, deleteExpiredThreads, findTrackedThreads, images, markExpiredThreads, mersenne, mongoose, promise, q, shouldCheckOrphanedTrackers, sweepPosts, sweepTrackers, threadExists, upkeep;
    mongoose = dependencies.mongoose, config = dependencies.config, q = dependencies.q, mersenne = dependencies.mersenne;
    promise = dependencies.lib('promises').promise;
    images = dependencies.lib('images');
    Thread = mongoose.model('Thread');
    Tracker = mongoose.model('Tracker');
    markExpiredThreads = function(board) {
      return promise(function(success, error) {
        return Thread.where({
          markedForDeletion: false
        }).update({
          markedForDeletion: true
        }).sort('updated', -1).skip(config.content.maximumThreadAmount).run(function(err, threads) {
          if (err) {
            return error(err);
          }
          return success(threads);
        });
      });
    };
    sweepPosts = function(thread) {
      var post, promises;
      promises = (function() {
        var _i, _len, _ref, _results;
        _ref = thread.posts;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          post = _ref[_i];
          images.deleteByPost(thread.board, post);
          _results.push(sweepTrackers(thread));
        }
        return _results;
      })();
      return q.join.apply(q, promises);
    };
    sweepTrackers = function(thread) {
      return promise(function(success, error) {
        return Tracker["delete"]().where({
          board: thread.board,
          thread: thread.id
        }).run(function(err) {
          if (err) {
            return error(err);
          }
          return success();
        });
      });
    };
    deleteExpiredThreads = function(board) {
      return markExpiredThreads(board).then(function(threads) {
        var promises, thread;
        promises = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = threads.length; _i < _len; _i++) {
            thread = threads[_i];
            _results.push(sweepPosts(thread).then(function() {
              thread.remove();
              return promise(function(success) {
                return success(thread);
              });
            }));
          }
          return _results;
        })();
        return q.join.apply(q, promises);
      });
    };
    findTrackedThreads = function(board) {
      return promise(function(success, error) {
        return Tracker.collection.distinct('thread', {
          board: board
        }, function(err, trackers) {
          var tracker;
          if (err) {
            return error(err);
          }
          return success((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = trackers.length; _i < _len; _i++) {
              tracker = trackers[_i];
              _results.push(tracker.thread);
            }
            return _results;
          })());
        });
      });
    };
    threadExists = function(board, id) {
      return promise(function(success, error) {
        return Thread.find({
          board: board,
          id: id
        }).run(function(err, thread) {
          if (err) {
            return error(err);
          }
          return success(!!thread);
        });
      });
    };
    checkOrphanedTrackers = function(board) {
      return findTrackedThreads(board).then(function(ids) {
        var id, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = ids.length; _i < _len; _i++) {
          id = ids[_i];
          _results.push(threadExists(board, id).then(function(doesExist) {
            if (!doesExist) {
              return sweepTrackers({
                board: board,
                thread: id
              });
            }
          }));
        }
        return _results;
      });
    };
    shouldCheckOrphanedTrackers = function() {
      return mersenne.rand(100) < config.content.orphanedTrackerCheckProbability;
    };
    upkeep = function(req, res) {
      deleteExpiredThreads(req.params.board);
      if (shouldCheckOrphanedTrackers()) {
        return checkOrphanedTrackers(req.params.board);
      }
    };
    return {
      upkeep: upkeep
    };
  };
}).call(this);
