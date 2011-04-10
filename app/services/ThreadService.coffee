AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->
  {mongoose} = dependencies
  
  Sequence = mongoose.model 'Sequence'
  Thread = mongoose.model 'Thread'
  Post = mongoose.model 'Post'

  class ThreadService extends AbstractService
                
    create: (data, error, success) ->
      Sequence.next data.thread.board,
        error,
        (seq) ->
          thread = new Thread data.thread
          post = new Post(data.post).toJSON()
          thread.id = post.id = seq.counter
          
          thread.posts.push post
          thread.firstPost = post
          
          thread.save (err) ->
            return error err if err
            success thread
    
    read: (query, error, success) ->
      Thread
      .find(board: query.board, id: query.id)
      .select('board', 'id', 'posts')
      .limit(1)
      .run (err, threads) ->
        return error err if err
        return error "thread not found" if not threads[0]
        success threads[0]
    
    update: (data, error, success) ->
      Sequence.next
        error: error
        board: data.thread.board
        success: (seq) ->
          post = new Post(data.post).toJSON()
          post.id = seq.counter
          Thread.collection.findAndModify { board: data.thread.board, id: data.thread.id },
              [],
              { $push: { posts: post }, lastPost: post },
              { new: false, upsert: false },
              (err, thread) ->
                return error err if err
                success thread
    
    delete: (thread, error, success) ->
      Thread.delete { board: thread.board, id: thread.id },
        [],
        (err, result) ->
          return error err if err
          success()
    ###