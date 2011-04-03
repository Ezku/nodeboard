module.exports = (dependencies) ->
  {mongoose, config} = dependencies
  
  mongoose.connect config.mongo.connection
  dependencies.services = {}
  dependencies.models = {}
  
  schema = (name) -> mongoose.model name, require(config.paths.schemas + name + "Schema")(mongoose)
  service = (name) -> dependencies.services[name] = require(config.paths.services + name + "Service")(dependencies)
  model = (name) -> dependencies.models[name] = require(config.paths.models + name + "Model")
  
  schema 'Sequence'
  schema 'Thread'
  
  service 'Board'
  service 'Post'
  service 'Thread'
  
  # TODO: use browserify entry point to declare these?
  model 'Model'
  model 'Post'
  model 'Thread'