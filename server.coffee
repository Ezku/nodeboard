dependencies = require('./app/dependencies.js')(__dirname)
require('./app/config.js')(dependencies)
require('./app/controllers.js')(dependencies)

{app} = dependencies

unless module.parent
  app.listen 3000
  console.log "Express server listening on port %d", app.address().port
