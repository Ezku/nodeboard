Backbone = require 'backbone'
Thread = require '../models/Thread.js'

module.exports = class Threads extends Backbone.Collection
  model: Thread
  url: -> "/api/#{@board}/"