(function() {
  module.exports = function(dependencies) {
    var app, coffeekup, express, paths;
    express = dependencies.express, paths = dependencies.paths, coffeekup = dependencies.coffeekup;
    app = dependencies.app = express.createServer();
    app.configure(function() {
      app.register('.coffee', coffeekup.adapters.express);
      app.set('view engine', 'coffee');
      app.set('views', paths.views);
      app.use(express.compiler({
        src: paths.public,
        enable: ['less']
      }));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(app.router);
      return app.use(express.static(paths.public));
    });
    app.configure('development', function() {
      return app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
    });
    return app.configure('production', function() {
      return app.use(express.errorHandler());
    });
  };
}).call(this);
