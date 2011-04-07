(function() {
  var AbstractService, unimplemented;
  unimplemented = function(data, success, error) {
    return error(new Error("Unimplemented service method"));
  };
  module.exports = AbstractService = (function() {
    function AbstractService() {}
    AbstractService.prototype.create = unimplemented;
    AbstractService.prototype.read = unimplemented;
    AbstractService.prototype.update = unimplemented;
    AbstractService.prototype["delete"] = unimplemented;
    return AbstractService;
  })();
}).call(this);
