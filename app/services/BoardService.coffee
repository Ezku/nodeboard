AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->
  {mongoose} = dependencies
  
  Thread = mongoose.model 'Thread'

  class BoardService extends AbstractService
    
    read: (query, error, success) ->
      Thread
      .find(board: query.board)
      .sort('id', -1)
      .run (err, threads) ->
        return error err if err
        success threads