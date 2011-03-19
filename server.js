(function() {
  var app, coffeekup, express;
  express = require('express');
  coffeekup = require('./vendor/coffeekup.js');
  app = module.exports = express.createServer();
  app.configure(function() {
    app.register('.coffee', coffeekup.adapters.express);
    app.set('view engine', 'coffee');
    app.set('views', __dirname + '/views');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express.static(__dirname + '/public'));
  });
  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure('production', function() {
    return app.use(express.errorHandler());
  });
  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'Aaltoboard?'
    });
  });
  if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
  }
}).call(this);
