(function() {
  var app;
  app = require('./app/bootstrap.js')(__dirname);
  if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
  }
}).call(this);
