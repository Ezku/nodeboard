(function() {
  module.exports = function(dependencies) {
    var app, coffeekup, config, express;
    express = dependencies.express, coffeekup = dependencies.coffeekup, config = dependencies.config;
    app = dependencies.app = express.createServer();
    app.configure(function() {
      app.register('.coffee', coffeekup.adapters.express);
      app.set('view engine', 'coffee');
      app.set('views', config.paths.views);
      app.use(express.compiler({
        src: config.paths.public,
        enable: ['less']
      }));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(app.router);
      app.use(express.static(config.paths.public));
      return app.use(dependencies.browserify({
        base: config.paths.shared,
        mount: '/scripts/browserify.js',
        filter: dependencies.jsmin.jsmin
      }));
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
    return app.dynamicHelpers({
      config: function() {
        return config;
      },
      include: function(req, res) {
        return res.render;
      }
    });
  };
}).call(this);
