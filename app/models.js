(function() {
  module.exports = function(dependencies) {
    var collection, config, model, mongoose, schema, service;
    mongoose = dependencies.mongoose, config = dependencies.config;
    mongoose.connect(config.mongo.connection);
    dependencies.services = {};
    dependencies.collections = {};
    dependencies.models = {};
    schema = function(name) {
      var schema, schemaData;
      schemaData = require(config.paths.schemas + name + "Schema")(mongoose);
      schema = new mongoose.Schema(schemaData.definition);
      if (schemaData.static) {
        schema.static(schemaData.static);
      }
      return mongoose.model(name, schema);
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
    service('Board');
    service('Thread');
    service('Post');
    return dependencies.services.get = function(name) {
      return new dependencies.services[name];
    };
  };
}).call(this);
