{exec} = require 'child_process'
console.log "Compiling Coffeescript files..."
exec "coffee -c #{__dirname}", (error, stdout, stderr) ->
  console.log stdout if stdout
  console.log stderr if stderr
  throw error if error
  
  app = require(__dirname + '/app/bootstrap.js')(__dirname)

  unless module.parent
    app.listen 3000
    console.log "Express server listening on port %d", app.address().port

