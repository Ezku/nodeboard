
var SYS = require("sys");
var Q = require("q-util");

var value = Q.retry({
    "max": 3,
    "onretry": function (trial, delay) {
        SYS.puts("retry " + trial + " " + delay);
    }
}, function () {
    return Q.reject("bah");
});

Q.when(value, SYS.puts, SYS.puts);

