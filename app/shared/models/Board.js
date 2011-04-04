(function() {
  var Backbone, Board;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Backbone = require('backbone');
  module.exports = Board = (function() {
    function Board() {
      Board.__super__.constructor.apply(this, arguments);
    }
    __extends(Board, Backbone.Model);
    Board.prototype.url = function() {
      return "/api/" + (this.id != null);
    };
    return Board;
  })();
}).call(this);
