
var SYS = require("sys");
var Q = require("q-util")
var UTIL = require("util");
var value = Q.reduce([1, 2, 3, 2, 1].map(function (n) {
    return Q.when(Q.delay(n * 1000), function () {
        return n;
    });
}), function (values, value) {
    SYS.puts("accumulating " + values + " " + value);
    return values + value;
});

Q.when(value, function (value) {
    SYS.puts(value);
});

