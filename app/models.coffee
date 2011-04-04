module.exports = (dependencies) ->
  {mongoose, config} = dependencies
  
  mongoose.connect config.mongo.connection
  
  dependencies.services = {}
  dependencies.collections = {}
  dependencies.models = {}
  
  # Declares a Mongoose schema
  schema = (name) -> mongoose.model name, require(config.paths.schemas + name + "Schema")(mongoose)
  
  # Declares a Service, ie. Model backend
  service = (name) -> dependencies.services[name] = require(config.paths.services + name + "Service")(dependencies)
  
  # Declares a Backbone Collection
  collection = (name) -> dependencies.collections[name] = require(config.paths.collections + name)
  
  # Declares a Backbone Model
  model = (name) -> dependencies.models[name] = require(config.paths.models + name)
  
  schema 'Sequence'
  schema 'Thread'
  
  service('Board').connect(model 'Board')
  service('Thread').connect(model 'Thread')
  service('Post').connect(model 'Post')
  
  collection 'Boards'
  collection 'Threads'
  collection 'Posts'