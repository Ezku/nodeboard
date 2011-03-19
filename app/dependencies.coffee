# Retrieves application dependencies (libraries and objects to be prepared)

module.exports = (root) ->
  vendor = (path) -> root + '/vendor/' + path

  dependencies =
    paths:
      root: root
      app: root + '/app/'
      models: root + '/app/models'
      views: root + '/app/views'
      public: root + '/public/'
      vendor: root + '/vendor/'
    express: require 'express'
    coffeekup: require vendor 'coffeekup.js'

  dependencies