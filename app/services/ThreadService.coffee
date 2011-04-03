module.exports = (dependencies) ->
  {mongoose} = dependencies
  
  Thread = mongoose.model 'Thread'
  Sequence = mongoose.model 'Sequence'

  class ThreadService
    
    create: (data, success, error) ->
      {thread, post} = data

      Sequence.next
        error: error
        board: thread.board
        success: (seq) ->
          result = new Thread thread
          result.id = result.latestPost = post.id = seq.counter
          result.posts.push post
          result.save (err) ->
            return error err if err
            success result
    
    read: (data, success, error) ->
      {board, id} = data
      Thread.find
        { board: board, id: id }
        []
        (err, result) ->
          return error err if err
          success result