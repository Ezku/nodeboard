module.exports = (dependencies) ->
  {mongoose, config} = dependencies
  mongoose.connect config.mongo.connection
  
  model = (name) -> mongoose.model name, require("./models/#{name}")(mongoose)
  models = (names...) -> model name for name in names
  