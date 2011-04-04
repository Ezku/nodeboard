(function() {
  var AbstractService;
  module.exports = AbstractService = (function() {
    function AbstractService() {}
    AbstractService.connect = function(Model) {
      var service;
      service = new this;
      Model.prototype.sync = function(method, model, success, error) {
        if (service[method]) {
          return service[method](model, success, error);
        } else {
          return error("unsupported method '" + method + "' on " + (model.url()));
        }
      };
      return this;
    };
    return AbstractService;
  })();
}).call(this);
