module.exports = (dependencies) ->
  {mongoose, config} = dependencies
  
  mongoose.connect config.mongo.connection
  
  dependencies.services = {}
  dependencies.collections = {}
  dependencies.models = {}
  
  # Declares a Mongoose schema
  schema = (name) ->
    schemaData = require(config.paths.schemas + name + "Schema")(mongoose, dependencies)
    modelSchema = new mongoose.Schema schemaData.definition
    if schemaData.static
      modelSchema.static schemaData.static
    mongoose.model name, modelSchema
  
  # Declares a Service, ie. Model backend
  service = (name) -> dependencies.services[name] = require(config.paths.services + name + "Service")(dependencies)
  
  schema 'Sequence'
  schema 'Thread'
  schema 'Post'
  schema 'Image'
  schema 'Tracker'
  
  service 'Board'
  service 'Thread'
  service 'Post'
  
  dependencies.services.get = (name) ->
    new dependencies.services[name]