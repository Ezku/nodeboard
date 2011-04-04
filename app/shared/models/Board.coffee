Backbone = require 'backbone'

module.exports = class Board extends Backbone.Model
  url: -> "/api/#{@id?}"