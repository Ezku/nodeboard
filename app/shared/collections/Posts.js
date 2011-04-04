(function() {
  var Backbone, Post, Posts;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Backbone = require('backbone');
  Post = require('../models/Post.js');
  module.exports = Posts = (function() {
    function Posts() {
      Posts.__super__.constructor.apply(this, arguments);
    }
    __extends(Posts, Backbone.Collection);
    Posts.prototype.model = Post;
    Posts.prototype.url = function() {
      return "/api/" + this.board + "/" + this.thread + "/";
    };
    return Posts;
  })();
}).call(this);
