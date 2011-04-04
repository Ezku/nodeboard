AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->
  {mongoose} = dependencies
  
  Thread = mongoose.model 'Thread'
  
  class PostService extends AbstractService
    