(function() {
  module.exports = function(dependencies) {
    var app, mongoose;
    app = dependencies.app, mongoose = dependencies.mongoose;
    return app.get('/', function(req, res) {
      return res.render('index', {
        title: 'Aaltoboard'
      });
    });
  };
}).call(this);
