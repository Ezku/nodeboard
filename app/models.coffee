module.exports = (dependencies) ->
  {mongoose, config} = dependencies
  
  mongoose.connect config.mongo.connection
  
  dependencies.services = {}
  dependencies.collections = {}
  dependencies.models = {}
  
  # Declares a Mongoose schema
  schema = (name) ->
    schemaData = require(config.paths.schemas + name + "Schema")(mongoose)
    schema = new mongoose.Schema schemaData.definition
    if schemaData.static
      schema.static schemaData.static
    mongoose.model name, schema
  
  # Declares a Service, ie. Model backend
  service = (name) -> dependencies.services[name] = require(config.paths.services + name + "Service")(dependencies)
  
  # Declares a Backbone Collection
  # @deprecated
  collection = (name) -> dependencies.collections[name] = require(config.paths.collections + name)
  
  # Declares a Backbone Model
  # @deprecated
  model = (name) -> dependencies.models[name] = require(config.paths.models + name)
  
  schema 'Sequence'
  schema 'Thread'
  
  service 'Board'
  service 'Thread'
  service 'Post'
  
  dependencies.services.get = (name) ->
    new dependencies.services[name]