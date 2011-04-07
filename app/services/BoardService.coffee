AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->
  {mongoose} = dependencies
  
  Thread = mongoose.model 'Thread'

  class BoardService extends AbstractService
    
    read: (board, success, error) ->
      Thread.find { board: board },
        [],
        (err, result) ->
          return error err if err
          success result