AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->
  {mongoose} = dependencies
  
  Thread = mongoose.model 'Thread'
  Sequence = mongoose.model 'Sequence'

  class ThreadService extends AbstractService
                
    create: (thread, success, error) ->
      post = thread.posts.first()
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
    
    read: (thread, success, error) ->
      Thread.find { board: thread.board, id: thread.id },
        [],
        (err, result) ->
          return error err if err
          success result
    
    update: (thread, success, error) ->
      post = thread.posts.last()

      Sequence.next
        error: error
        board: thread.board
        success: (seq) ->
          post.id = seq.counter
          Thread.collection.findAndModify { board: thread.board, id: thread.id },
              [],
              { $push: { posts: post }, latestPost: seq.counter },
              { new: false, upsert: false },
              (err, thread) ->
                return error err if err
                success thread
    
    delete: (thread, success, error) ->
      Thread.delete { board: thread.board, id: thread.id },
        [],
        (err, result) ->
          return error err if err
          success()