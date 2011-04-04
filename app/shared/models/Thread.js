(function() {
  var Backbone, Posts, Thread;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Backbone = require('backbone');
  Posts = require('../collections/Posts.js');
  module.exports = Thread = (function() {
    function Thread() {
      Thread.__super__.constructor.apply(this, arguments);
    }
    __extends(Thread, Backbone.Model);
    Thread.prototype.url = function() {
      return "/api/" + this.board + "/" + (this.id != null);
    };
    Thread.prototype.initialize = function() {
      return this.posts = new Posts(this.posts);
    };
    return Thread;
  })();
}).call(this);
