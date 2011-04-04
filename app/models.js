(function() {
  module.exports = function(dependencies) {
    var collection, config, model, mongoose, schema, service;
    mongoose = dependencies.mongoose, config = dependencies.config;
    mongoose.connect(config.mongo.connection);
    dependencies.services = {};
    dependencies.collections = {};
    dependencies.models = {};
    schema = function(name) {
      return mongoose.model(name, require(config.paths.schemas + name + "Schema")(mongoose));
    };
    service = function(name) {
      return dependencies.services[name] = require(config.paths.services + name + "Service")(dependencies);
    };
    collection = function(name) {
      return dependencies.collections[name] = require(config.paths.collections + name);
    };
    model = function(name) {
      return dependencies.models[name] = require(config.paths.models + name);
    };
    schema('Sequence');
    schema('Thread');
    service('Board').connect(model('Board'));
    service('Thread').connect(model('Thread'));
    service('Post').connect(model('Post'));
    collection('Boards');
    collection('Threads');
    return collection('Posts');
  };
}).call(this);
