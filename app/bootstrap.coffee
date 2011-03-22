module.exports = (root) ->
  dependencies = require('./bootstrap/dependencies.js')(root)
  dependencies.config = require('./bootstrap/config.js')(root)
  require('./bootstrap/express.js')(dependencies)

  require('./models.js')(dependencies)
  require('./controllers.js')(dependencies)

  dependencies.app