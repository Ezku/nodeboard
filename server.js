(function() {
  var app, dependencies;
  dependencies = require('./app/dependencies.js')(__dirname);
  require('./app/config.js')(dependencies);
  require('./app/controllers.js')(dependencies);
  app = dependencies.app;
  if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
  }
}).call(this);
