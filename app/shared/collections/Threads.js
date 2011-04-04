(function() {
  var Backbone, Thread, Threads;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Backbone = require('backbone');
  Thread = require('../models/Thread.js');
  module.exports = Threads = (function() {
    function Threads() {
      Threads.__super__.constructor.apply(this, arguments);
    }
    __extends(Threads, Backbone.Collection);
    Threads.prototype.model = Thread;
    Threads.prototype.url = function() {
      return "/api/" + this.board + "/";
    };
    return Threads;
  })();
}).call(this);
