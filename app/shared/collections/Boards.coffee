Backbone = require 'backbone'
Board = require '../models/Board.js'

module.exports = class Boards extends Backbone.Collection
  model: Board
  url: -> "/api/"