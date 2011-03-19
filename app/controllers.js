(function() {
  module.exports = function(dependencies) {
    var app;
    app = dependencies.app;
    return app.get('/', function(req, res) {
      return res.render('index', {
        title: 'Aaltoboard'
      });
    });
  };
}).call(this);
