(function() {
  module.exports = function(root) {
    var dependencies;
    dependencies = require('./bootstrap/dependencies.js')(root);
    dependencies.config = require('./bootstrap/config.js')(root);
    require('./bootstrap/express.js')(dependencies);
    require('./models.js')(dependencies);
    require('./controllers.js')(dependencies);
    return dependencies.app;
  };
}).call(this);
