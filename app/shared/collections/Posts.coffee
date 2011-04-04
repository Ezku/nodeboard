Backbone = require 'backbone'
Post = require '../models/Post.js'

module.exports = class Posts extends Backbone.Collection
  model: Post
  url: -> "/api/#{@board}/#{@thread}/"