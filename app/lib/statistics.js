(function() {
  module.exports = function(dependencies) {
    var Thread, Tracker, all, mongoose, promise, stats, _ref;
    mongoose = dependencies.mongoose;
    _ref = dependencies.lib('promises'), promise = _ref.promise, all = _ref.all;
    Thread = mongoose.model('Thread');
    Tracker = mongoose.model('Tracker');
    stats = {
      "Users online": function() {
        return promise(function(success, error) {
          return success(4);
        });
      }
    };
    return function() {
      var calculate, promises, results, statistic;
      results = {};
      promises = (function() {
        var _results;
        _results = [];
        for (statistic in stats) {
          calculate = stats[statistic];
          _results.push((function(statistic) {
            return calculate().then(function(result) {
              results[statistic] = result;
              return promise(function(success) {
                return success();
              });
            });
          })(statistic));
        }
        return _results;
      })();
      return all.apply(null, promises).then(function() {
        return promise(function(success) {
          return success(results);
        });
      });
    };
  };
}).call(this);
