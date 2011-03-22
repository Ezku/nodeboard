dependencies = require('./bootstrap/dependencies.js')(__dirname)
dependencies.config = require('./bootstrap/config.js')(__dirname)
require('./bootstrap/express.js')(dependencies)

require('./models.js')(dependencies)
require('./controllers.js')(dependencies)

module.exports = dependencies.app