app = require './app/bootstrap.js'

unless module.parent
  app.listen 3000
  console.log "Express server listening on port %d", app.address().port
