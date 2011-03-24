(function() {
  var __slice = Array.prototype.slice;
  module.exports = function(dependencies) {
    var config, model, models, mongoose;
    mongoose = dependencies.mongoose, config = dependencies.config;
    mongoose.connect(config.mongo.connection);
    model = function(name) {
      return mongoose.model(name, require("./models/" + name)(mongoose));
    };
    models = function() {
      var name, names, _i, _len, _results;
      names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        _results.push(model(name));
      }
      return _results;
    };
    model('Sequence');
    model('Tracker');
    model('Post');
    return model('Thread');
  };
}).call(this);
