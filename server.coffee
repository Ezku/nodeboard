
#Module dependencies.

express = require 'express'
coffeekup = require './vendor/coffeekup.js'
app = module.exports = express.createServer()

# Configuration

app.configure ->
  app.register '.coffee', coffeekup.adapters.express
  app.set 'view engine', 'coffee'
  app.set 'views', __dirname + '/views'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static(__dirname + '/public')

app.configure 'development', ->
  app.use express.errorHandler dumpExceptions: true, showStack: true

app.configure 'production', ->
  app.use express.errorHandler()

# Routes

app.get '/', (req, res) ->
  res.render 'index',
    title: 'Aaltoboard'

# Only listen on $ node app.js

unless module.parent
  app.listen 3000
  console.log "Express server listening on port %d", app.address().port
