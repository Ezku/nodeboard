(function() {
  module.exports = function(dependencies) {
    var app, config, mongoose;
    app = dependencies.app, mongoose = dependencies.mongoose, config = dependencies.config;
    app.dynamicHelpers({
      config: function() {
        return config;
      }
    });
    return app.get('/', function(req, res) {
      return res.render('index', {
        title: 'Aaltoboard'
      });
    });
  };
}).call(this);
