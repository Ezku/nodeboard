(function() {
  module.exports = function(dependencies) {
    var app, coffeekup, config, express, helpers;
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
      return app.use(express.static(config.paths.mount));
      /*
          app.use dependencies.browserify
            base: config.paths.shared
            mount: '/scripts/browserify.js'
            require: ['coffeekup']
            #filter: dependencies.jsmin.jsmin
          */
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
    helpers = dependencies.lib('helpers');
    app.helpers(helpers.static);
    return app.dynamicHelpers(helpers.dynamic);
  };
}).call(this);
