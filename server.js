(function() {
  var exec;
  exec = require('child_process').exec;
  console.log("Compiling Coffeescript files...");
  exec("coffee -c " + __dirname, function(error, stdout, stderr) {
    var app;
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.log(stderr);
    }
    if (error) {
      throw error;
    }
    app = require(__dirname + '/app/bootstrap.js')(__dirname);
    if (!module.parent) {
      app.listen(3000);
      return console.log("Express server listening on port %d", app.address().port);
    }
  });
}).call(this);
