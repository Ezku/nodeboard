Backbone = require 'backbone'

module.exports = class Post extends Backbone.Model
  url: -> "/api/#{@board}/#{@thread}/#{@id?}/"