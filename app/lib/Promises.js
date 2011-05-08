(function() {
  module.exports = function(dependencies) {
    var all, promise, q;
    q = dependencies.q;
    promise = function(f) {
      var deferred, result;
      deferred = q.defer();
      result = f(deferred.resolve, deferred.reject);
      return deferred.promise;
    };
    /*
    Given a list of promises, creates a promise that will be resolved or rejected
    when all the promises on the list have either been resolved or rejected. In
    case of mixed successes the result will be a rejection.
    */
    all = function(promises) {
      return promise(function(resolve, reject) {
        var next, p, rejected, resolved, _i, _len, _results;
        if (promises.length === 0) {
          resolve();
        }
        resolved = [];
        rejected = [];
        next = function() {
          if (resolved.length + rejected.length !== promises.length) {
            return;
          }
          if (rejected.length === 0) {
            return resolve(resolved);
          } else {
            return reject(rejected);
          }
        };
        _results = [];
        for (_i = 0, _len = promises.length; _i < _len; _i++) {
          p = promises[_i];
          _results.push(p.then(function(value) {
            resolved.push(value);
            return next();
          }, function(error) {
            rejected.push(error);
            return next();
          }));
        }
        return _results;
      });
    };
    return {
      promise: promise,
      all: all
    };
  };
}).call(this);
