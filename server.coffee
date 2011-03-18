
#Module dependencies.

express = require 'express'
app = module.exports = express.createServer()

# Configuration

app.register '.coffee', require 'coffeekup'
app.set 'view engine', 'coffee'

app.configure ->
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
		title: 'Express'

# Only listen on $ node app.js

unless module.parent
	app.listen 3000
	console.log "Express server listening on port %d", app.address().port
