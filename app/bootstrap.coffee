module.exports = (root) ->
  dependencies = require('./bootstrap/dependencies')(root)
  dependencies.config = require('./bootstrap/config')(root)
  require('./bootstrap/express')(dependencies)

  require('./models')(dependencies)
  require('./controllers')(dependencies)

  dependencies.app