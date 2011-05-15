(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  module.exports = function(dependencies) {
    var PreconditionError;
    return PreconditionError = (function() {
      __extends(PreconditionError, Error);
      function PreconditionError(msg) {
        this.name = 'PreconditionError';
        this.message = msg;
        Error.captureStackTrace(this, arguments.callee);
      }
      return PreconditionError;
    })();
  };
}).call(this);
