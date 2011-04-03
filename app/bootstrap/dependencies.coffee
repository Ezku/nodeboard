# Retrieves application dependencies

module.exports = (root) ->

  dependencies =
    express: require 'express'
    mongoose: require 'mongoose'
    coffeekup: require root + '/vendor/coffeekup.js'
    backbone: require 'backbone'
    browserify: require 'browserify'
    jsmin: require 'jsmin'

  dependencies