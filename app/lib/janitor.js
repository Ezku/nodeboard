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
        console.log("sweeping trackers for thread " + (thread.id.toString()));
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
      console.log("sweeping posts for thread " + (thread.id.toString()));
      promises = (function() {
        var _i, _len, _ref2, _results;
        _ref2 = thread.posts;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          post = _ref2[_i];
          images.deleteByPost(thread.board, post);
          sweepTrackers(thread);
          _results.push(console.log('done sweeping trackers'));
        }
        return _results;
      })();
      return all(promises);
    };
    sweepThreads = function(board) {
      return Thread.sweep(board, config.content.maximumThreadAmount).then(function(threads) {
        var promises, thread;
        console.log((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = threads.length; _i < _len; _i++) {
            thread = threads[_i];
            _results.push(Number(thread.id.toString()));
          }
          return _results;
        })());
        promises = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = threads.length; _i < _len; _i++) {
            thread = threads[_i];
            console.log("deleting thread " + (thread.id.toString()));
            _results.push(sweepPosts(thread).then(function() {
              console.log('done sweeping posts');
              thread.remove();
              return promise(function(success) {
                return success(thread);
              });
            }));
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
