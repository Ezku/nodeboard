(function() {
  module.exports = function(dependencies) {
    var dynamic, static;
    static = {
      config: dependencies.config
    };
    dynamic = {};
    return {
      static: static,
      dynamic: dynamic
    };
  };
}).call(this);
