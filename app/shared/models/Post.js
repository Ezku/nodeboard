(function() {
  var Backbone, Post;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Backbone = require('backbone');
  module.exports = Post = (function() {
    function Post() {
      Post.__super__.constructor.apply(this, arguments);
    }
    __extends(Post, Backbone.Model);
    Post.prototype.url = function() {
      return "/api/" + this.board + "/" + this.thread + "/" + (this.id != null) + "/";
    };
    return Post;
  })();
}).call(this);
