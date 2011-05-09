(function() {
  module.exports = function(dependencies) {
    var config, mongoose, schema, service;
    mongoose = dependencies.mongoose, config = dependencies.config;
    mongoose.connect(config.mongo.connection);
    dependencies.services = {};
    dependencies.collections = {};
    dependencies.models = {};
    schema = function(name) {
      var schema, schemaData;
      schemaData = require(config.paths.schemas + name + "Schema")(mongoose, dependencies);
      schema = new mongoose.Schema(schemaData.definition);
      if (schemaData.static) {
        schema.static(schemaData.static);
      }
      return mongoose.model(name, schema);
    };
    service = function(name) {
      return dependencies.services[name] = require(config.paths.services + name + "Service")(dependencies);
    };
    schema('Sequence');
    schema('Thread');
    schema('Post');
    schema('Image');
    schema('Tracker');
    service('Board');
    service('Thread');
    service('Post');
    return dependencies.services.get = function(name) {
      return new dependencies.services[name];
    };
  };
}).call(this);
