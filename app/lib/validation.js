(function() {
  module.exports = function(dependencies) {
    var ValidationError, filter, promise, services, shouldHaveImage, shouldHaveImageOrContent, _ref;
    services = dependencies.services;
    _ref = dependencies.lib('promises'), promise = _ref.promise, filter = _ref.filter;
    ValidationError = dependencies.lib('errors/ValidationError');
    shouldHaveImage = filter(function(req, res) {
      return promise(function(success, error) {
        var _ref2;
        if (!((_ref2 = req.files) != null ? _ref2.image : void 0)) {
          return error(new ValidationError("A new thread should have an image"));
        } else {
          return success();
        }
      });
    });
    shouldHaveImageOrContent = filter(function(req, res) {
      return promise(function(success, error) {
        var _ref2, _ref3, _ref4;
        if (!((_ref2 = req.files) != null ? _ref2.image : void 0) && !((_ref3 = req.body) != null ? (_ref4 = _ref3.content) != null ? _ref4.length : void 0 : void 0)) {
          return error(new ValidationError("A reply should have either an image or some content"));
        } else {
          return success();
        }
      });
    });
    return {
      shouldHaveImage: shouldHaveImage,
      shouldHaveImageOrContent: shouldHaveImageOrContent
    };
  };
}).call(this);
