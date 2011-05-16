(function() {
  module.exports = function(dependencies) {
    var all, fail, filter, promise, q, qutil, succeed;
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
    succeed = function(result) {
      return promise(function(success) {
        return success(result);
      });
    };
    fail = function(reason) {
      return promise(function(success, error) {
        return error(reason);
      });
    };
    return {
      promise: promise,
      all: all,
      filter: filter,
      succeed: succeed,
      fail: fail
    };
  };
}).call(this);
