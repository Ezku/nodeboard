app = require(__dirname + '/app/bootstrap')(__dirname)
app.listen 3000
console.log "Express server listening on port %d", app.address().port
