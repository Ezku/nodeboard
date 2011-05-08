
AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->

  {mongoose} = dependencies
  {promise} = dependencies.lib 'promises'
  ImageProcessor = dependencies.lib 'ImageProcessor'
  Sequence = mongoose.model 'Sequence'
  Thread = mongoose.model 'Thread'
  Post = mongoose.model 'Post'

  class ThreadService extends AbstractService
    
    read: (query) -> promise (success, error) ->
      Thread
      .find(board: String(query.board), id: Number(query.id))
      .select('board', 'id', 'posts')
      .limit(1)
      .run (err, threads) ->
        return error err if err
        return error new Error("thread not found") if not threads[0]
        success threads[0]
    
    create: (data) ->
      Sequence.next(data.thread.board).then (seq) =>
        @_processImage(data.image, data.thread.board, seq.counter).then (image) ->
          thread = new Thread data.thread
          post = new Post(data.post).toJSON()
          post.image = image?.toJSON()
          thread.id = post.id = seq.counter
    
          thread.posts.push post
          thread.firstPost = post
          
          promise (success, error) ->
            thread.save (err) ->
              return error err if err
              success thread
    
    update: (data) ->
      Sequence.next(data.thread.board).then (seq) =>
        @_processImage(data.image, data.thread.board, seq.counter).then (image) ->
          post = new Post(data.post).toJSON()
          post.id = seq.counter
          post.image = image?.toJSON()
          Thread.addReply data.thread.board, data.thread.id, post
    
    _processImage: (image, board, id) ->
      processor = new ImageProcessor image, board, id
      processor.process()
    
    ###
    delete: (thread, error, success) ->
      Thread.delete { board: thread.board, id: thread.id },
        [],
        (err, result) ->
          return error err if err
          success()
    ###
