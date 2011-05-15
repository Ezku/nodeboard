(function() {
  module.exports = function(dependencies) {
    var Thread, Tracker, all, checkOrphanedTrackers, config, findTrackedThreads, images, mersenne, mongoose, promise, q, shouldCheckOrphanedTrackers, sweepPosts, sweepThreads, sweepTrackers, threadExists, upkeep, _ref;
    mongoose = dependencies.mongoose, config = dependencies.config, q = dependencies.q, mersenne = dependencies.mersenne;
    _ref = dependencies.lib('promises'), promise = _ref.promise, all = _ref.all;
    images = dependencies.lib('images');
    Thread = mongoose.model('Thread');
    Tracker = mongoose.model('Tracker');
    sweepTrackers = function(thread) {
      return promise(function(success, error) {
        return Tracker.remove({
          board: thread.board,
          thread: thread.id
        }, function(err) {
          if (err) {
            return error(err);
          }
          return success();
        });
      });
    };
    sweepPosts = function(thread) {
      var post, promises;
      promises = (function() {
        var _i, _len, _ref2, _results;
        _ref2 = thread.posts;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          post = _ref2[_i];
          images.deleteByPost(thread.board, post);
          _results.push(promise(function(success) {
            return success();
          }));
        }
        return _results;
      })();
      return all(promises);
    };
    sweepThreads = function(board) {
      return Thread.sweep(board, config.content.maximumThreadAmount).then(function(threads) {
        var promises, thread;
        promises = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = threads.length; _i < _len; _i++) {
            thread = threads[_i];
            _results.push((function(thread) {
              return sweepPosts(thread).then(function() {
                thread.remove();
                return promise(function(success) {
                  return success(thread);
                });
              });
            })(thread));
          }
          return _results;
        })();
        return all(promises);
      });
    };
    findTrackedThreads = function(board) {
      return promise(function(success, error) {
        return Tracker.collection.distinct('thread', {
          board: board
        }, function(err, threads) {
          if (err) {
            return error(err);
          }
          return success(threads);
        });
      });
    };
    threadExists = function(board, id) {
      return promise(function(success, error) {
        return Thread.findOne({
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
          _results.push((function(id) {
            return threadExists(board, id).then(function(doesExist) {
              if (!doesExist) {
                return sweepTrackers({
                  board: board,
                  id: id
                });
              }
            });
          })(id));
        }
        return _results;
      });
    };
    shouldCheckOrphanedTrackers = function() {
      return mersenne.rand(100) < config.content.orphanedTrackerCheckProbability;
    };
    upkeep = function(req, res) {
      sweepThreads(req.params.board);
      if (shouldCheckOrphanedTrackers()) {
        return checkOrphanedTrackers(req.params.board);
      }
    };
    return {
      upkeep: upkeep
    };
  };
}).call(this);
