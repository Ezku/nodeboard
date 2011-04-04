Backbone = require 'backbone'
Posts = require '../collections/Posts.js'

module.exports = class Thread extends Backbone.Model
  url: -> "/api/#{@board}/#{@id?}"
  initialize: ->
    @posts = new Posts @posts