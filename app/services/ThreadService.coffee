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
          #thread.set 'id', seq.counter
          #thread.set 'latestPost', seq.counter
          #post.set 'id', seq.counter
          
          result = new Thread thread.toJSON()
          result.posts.push post.toJSON()
          result.save (err) ->
            return error err if err
            success()
    
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