AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->
  {mongoose} = dependencies
  
  Thread = mongoose.model 'Thread'
  Sequence = mongoose.model 'Sequence'

  class ThreadService extends AbstractService
                
    create: (data, error, success) ->
      Sequence.next data.thread.board,
        error,
        (seq) ->
          thread = new Thread data.thread
          thread.id = data.post.id = seq.counter
          
          thread.firstPost = data.post
          thread.posts.push data.post
          
          thread.save (err) ->
            return error err if err
            success thread
    
    ###
    read: (thread, success, error) ->
      Thread.find { board: thread.board, id: thread.id },
        ['board', 'id', 'posts'],
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
              { $push: { posts: post }, lastPost: post },
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
    ###