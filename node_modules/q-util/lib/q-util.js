
var Q = exports;
var UTIL = require("n-util");
var QBASE = require("q");

UTIL.update(Q, QBASE);

/**
 * @param {Number} timeout
 * @returns {Promise * undefined} a promise for `undefined`
 * that will resolve after `timeout` miliseconds.
 */
Q.delay = function (timeout, callback) {
    var deferred = Q.defer();
    setTimeout(deferred.resolve, timeout);
    if (callback)
        return Q.when(deferred.promise, callback);
    else
        return deferred.promise;
};

function reducer(direction) {
    return function (values, callback, basis, that) {
        return Q.when(that, function (that) {
            return Q.when(values, function (values) {
                return UTIL.array(values)[direction](function (values, value) {
                    return Q.when(values, function (values) {
                        return Q.when(value, function (value) {
                            return callback.call(that, values, value);
                        });
                    });
                }, basis);
            });
        });
    }
}

Q.reduce = reducer('reduce');
Q.reduceRight = reducer('reduceRight');
Q.reduce = function (values, callback, accumulator, that) {
    var accumulators = [];
    if (arguments.length > 2)
        accumulators.push(accumulator);
    var reduction = Q.defer();

    Q.when(Q.shallow(UTIL.map(values, function (value) {
        return Q.when(value, function (value) {
            accumulators.push(value);
            reduce();
        });
    })), function () {
        // assert accumulators.length == 1
        reduction.resolve(accumulators.shift());
    }, function (reason) {
        reduction.reject({
            "child": reason
        });
    });

    function reduce() {
        if (accumulators.length < 2)
            return;
        Q.when(callback.call(
            that,
            accumulators.shift(),
            accumulators.shift()
        ), function (value) {
            accumulators.push(value);
            reduce();
        }, function (reason) {
            reduction.reject({
                "message": "error in reduction",
                "child": reason
            });
        });
    }

    return reduction.promise;
};

/** */
Q.reduceLeft = function (values, callback, basis, that) {
    return Q.when(values, function (values) {
        return UTIL.array(values).reduce(function (values, value) {
            return Q.when(values, function (values) {
                return Q.when(value, function (value) {
                    return callback(values, value);
                });
            });
        }, basis);
    });
};

/**
 * @param {Array * Promise} values that may include promises.
 * @returns {Promise * Array} a promise for an array of each
 * resolved value respectively.
 */
Q.shallow = function (values) {
    return Q.reduceLeft(values, function (values, value) {
        return values.concat([value]);
    }, []);
};

Q.deep = function (object) {
    return Q.when(object, function (object) {
        if (UTIL.no(object)) {
            return object;
        } if (Array.isArray(object)) {
            return Q.shallow(object.map(Q.deep));
        } else if (typeof object === "object") {
            return Q.whenAll(UTIL.mapApply(object, function (key, value) {
                return Q.when(Q.deep(value), function (value) {
                    return [key, value];
                });
            }), function (pairs) {
                return UTIL.object(pairs);
            });
        } else {
            return object;
        }
    });
};

/**
 */
Q.forEach = function (values, callback, thisp) {
    var last;
    return Q.when(values.forEach(function (value) {
        last = Q.when(last, function () {
            return Q.when(value, function (value) {
                return callback.call(thisp, value);
            });
        });
    }), function () {
        return last;
    });
};

/**
 * Calls each function in order with the resolved return
 * value of the previous. 
 *
 * `Q.chain(f, g, h)` is equivalent to
 * `[f, g, h].reduce(Q.when, undefined)`
 *
 * @param {Array * f(x)}
 * @returns {Promise}
 */
Q.chain = function () {
    return Array.prototype.reduce.call(
        arguments,
        Q.when,
        undefined
    );
};

/**
 * @param {Array * Promise} values a promise for an array of
 * promises.
 * @returns {Promise * Array} a promise for the sum of the
 * resolved.
 */
Q.sum = function (values) {
    return Q.reduceLeft(values, function (values, value) {
        return values + value;
    }, 0);
};

/**
 * Wraps a `when` block
 * @param {Array * Promise}
 * @param {Function} resolved
 * @param {Function} rejected optional
 */
Q.whenAll = function (values, resolved, rejected) {
    return Q.when(Q.shallow(values), resolved, rejected);
};

/**
 * @param {Array * Promise} values
 * @param {Function} callback
 * @param {Promise * Object} thisp optional this object for
 * the callback
 * @returns {Array * Promise} an array of promises for the
 * returned results of the callback on each respective
 * resolved value.
 */
Q.map = function (values, callback, thisp) {
    return values.map(function (value) {
        return Q.when(value, function (value) {
            return Q.when(thisp, function (thisp) {
                return callback.call(thisp);
            });
        });
    });
};

Q.loop = function (provider, block) {
    function loop() {
        Q.when(provider(), function (value) {
            Q.when(block(value), function (result) {
                if (result !== false)
                    loop();
            });
        });
    }
    loop();
};

Q.times = function (n, callback) {
    function loop(n) {
        if (n <= 0)
            return;
        return Q.when(callback(), function () {
            return loop(n - 1);
        });
    }
    return loop(n);
};

Q.retry = function (options, callback, that) {
    function loop(trial, delay) {
        return Q.when(callback.call(that), function (value) {
            return value;
        }, function (reason) {
            if (trial >= (options.max || Infinity))
                return Q.reject(reason)
            options.onretry && options.onretry(trial + 1, delay);
            return Q.when(Q.delay(delay), function () {
                return loop(
                    trial + 1,
                    delay * (options.backOff || 2)
                );
            });
        });
    }
    return loop(0, options.delay || 1000);
};

/**
 * A promise queue.  Each promise returned by get is
 * eventually resolved by a value given to put, in the order
 * in which they are requested and received.
 */
Q.Queue = function (max) {
    if (max === undefined)
        max = Infinity;
    var self = Object.create(Q.Queue.prototype);
    var promises = [];
    var resolvers = [];

    function grow() {
        if (promises.length > max || resolvers.length > max)
            return false;
        var deferred = Q.defer();
        promises.push(deferred.promise);
        resolvers.push(deferred.resolve);
        return true;
    };

    /***
     * @returns a promise
     */
    self.get = function () {
        if (!promises.length) {
            if (!grow())
                return Q.reject("queue jammed");
        }
        return promises.shift();
    };

    /***
     * @param value a resolution
     */
    self.put = function (value) {
        if (!resolvers.length) {
            if (!grow())
                return Q.reject("queue jammed");
        }
        resolvers.shift()(value);
    };

    return self;
};

Q.Buffer = function () {
    var self = Object.create(Q.Buffer.prototype);
    var buffer = [];
    var ready = Q.defer();

    function flush() {
        return Q.when(ready.promise, function () {
            if (buffer.length) {
                return buffer.splice(0, buffer.length);
            } else {
                ready = Q.defer();
                return flush();
            }
        });
    }

    function get() {
        return Q.when(ready.promise, function () {
            if (buffer.length) {
                return buffer.shift();
            } else {
                ready = Q.defer();
                return get();
            }
        });
    }

    self.get = function () {
        return get();
    };

    self.flush = function () {
        return flush();
    };

    self.put = function (value) {
        buffer.push(value);
        ready.resolve();
    };

    return self;
};

/* demo */
if (module === require.main) {
    Q.whenAll([
        1,
        2,
        3,
        Q.when(Q.delay(1000), function () {return 4})
    ], function (values) {
        print(values);
    });
}

