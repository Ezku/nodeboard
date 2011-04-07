# Configures the Express application instance

module.exports = (dependencies) ->
  {express, coffeekup, config} = dependencies
  
  app = dependencies.app = express.createServer()
  
  app.configure ->
    app.register '.coffee', coffeekup.adapters.express
    app.set 'view engine', 'coffee'
    app.set 'views', config.paths.views
    
    app.use express.compiler src: config.paths.public, enable: ['less']
    app.use express.bodyParser()
    app.use express.methodOverride()
    app.use app.router
    app.use express.static config.paths.public
#    app.use dependencies.browserify
#      base: config.paths.shared
#      mount: '/scripts/browserify.js',
#      filter: dependencies.jsmin.jsmin

  app.configure 'development', ->
    app.use express.errorHandler dumpExceptions: true, showStack: true

  app.configure 'production', ->
    app.use express.errorHandler()
  
  app.dynamicHelpers
    # Make config settings available in view scope
    config: -> config
    # Enable views to render subviews
    # TODO: fix :D
    include: (req, res) -> res.render