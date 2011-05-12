(function() {
  var AbstractService;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  AbstractService = require('./AbstractService.js');
  module.exports = function(dependencies) {
    var PostService, Thread, mongoose;
    mongoose = dependencies.mongoose;
    Thread = mongoose.model('Thread');
    return PostService = (function() {
      __extends(PostService, AbstractService);
      function PostService() {
        PostService.__super__.constructor.apply(this, arguments);
      }
      return PostService;
    })();
  };
}).call(this);
