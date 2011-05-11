
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
      # TODO: Find out how to filter out unwanted output from posts
      .select('board', 'id', 'posts')
      .limit(1)
      .run (err, threads) ->
        return error err if err
        return error new Error("thread not found") if not threads[0]
        success threads[0]
    
    create: (data) ->
      Sequence.next(data.thread.board).then (seq) =>
        @_processImage(data.image, data.thread.board, seq.counter).then (image) =>
          post = @_post data.post, seq.counter, image
          thread = @_thread data.thread, post
          
          promise (success, error) ->
            thread.save (err) ->
              return error err if err
              success thread
    
    
    update: (data) ->
      Sequence.next(data.thread.board).then (seq) =>
        @_processImage(data.image, data.thread.board, seq.counter).then (image) =>
          post = @_post data.post, seq.counter, image
          Thread.addReply data.thread.board, data.thread.id, post
    
    _processImage: (image, board, id) ->
      processor = new ImageProcessor image, board, id
      processor.process()
    
    _post: (data, id, image) ->
      data.id = id
      data.image = image?.toJSON()
      new Post(data).toJSON()
    
    _thread: (data, post) ->
      data.id = post.id
      data.firstPost = post
      thread = new Thread data
      thread.posts.push post
      thread
    
    ###
    delete: (thread, error, success) ->
      Thread.delete { board: thread.board, id: thread.id },
        [],
        (err, result) ->
          return error err if err
          success()
    ###
