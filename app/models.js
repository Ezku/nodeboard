(function() {
  module.exports = function(dependencies) {
    var config, model, models, mongoose, schema;
    mongoose = dependencies.mongoose, config = dependencies.config;
    mongoose.connect(config.mongo.connection);
    schema = function(name) {
      return mongoose.model(name, require("./schemas/" + name)(mongoose));
    };
    schema('Sequence');
    schema('Thread');
    models = dependencies.models = {};
    model = function(name) {
      return dependencies.models[name] = require("./models/" + name)(dependencies);
    };
    model('Model');
    model('Thread');
    return model('Post');
  };
}).call(this);
