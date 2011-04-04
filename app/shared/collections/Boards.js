(function() {
  var Backbone, Board, Boards;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Backbone = require('backbone');
  Board = require('../models/Board.js');
  module.exports = Boards = (function() {
    function Boards() {
      Boards.__super__.constructor.apply(this, arguments);
    }
    __extends(Boards, Backbone.Collection);
    Boards.prototype.model = Board;
    Boards.prototype.url = function() {
      return "/api/";
    };
    return Boards;
  })();
}).call(this);
