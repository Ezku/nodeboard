module.exports = (dependencies) ->
  {mongoose} = dependencies
  
  Thread = mongoose.model 'Thread'

  class BoardService
    
    read: (data, success, error) ->
      {board, id} = data
      Thread.find
        { board: board, id: id }
        []
        (err, result) ->
          return error err if err
          success result