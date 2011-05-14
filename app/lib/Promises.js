(function() {
  module.exports = function(dependencies) {
    var all, filter, promise, q, qutil;
    q = dependencies.q, qutil = dependencies.qutil;
    promise = function(f) {
      var deferred, result;
      deferred = q.defer();
      result = f(deferred.resolve, deferred.reject);
      if (q.isPromise(result)) {
        return result;
      } else {
        return deferred.promise;
      }
    };
    filter = function(f) {
      return function(req, res, next) {
        return q.when(f(req, res), (function() {
          return next();
        }), (function(err) {
          return next(err);
        }));
      };
    };
    all = qutil.whenAll;
    return {
      promise: promise,
      all: all,
      filter: filter
    };
  };
}).call(this);
