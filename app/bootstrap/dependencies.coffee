# Retrieves application dependencies

module.exports = (root) ->

  dependencies =
    express: require 'express'
    mongoose: require 'mongoose'
    coffeekup: require root + '/vendor/coffeekup.js'
    channels: require root + '/vendor/socket.io-channels/index.js'
    backbone: require 'backbone'
    browserify: require 'browserify'
    jsmin: require 'jsmin'
    formidable: require 'formidable'
    imagemagick: require 'imagemagick'
    io: require 'socket.io'
    hashlib: require 'hashlib'
    q: require 'q'
    qutil: require 'q-util'
    '_': require 'underscore'
    mersenne: require 'mersenne'
  
  dependencies.lib = do ->
    libs = {}
    (name) ->
      if not libs[name]?
        libs[name] = require(root + '/app/lib/' + name + '.js')(dependencies)
      libs[name]

  dependencies