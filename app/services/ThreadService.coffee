fs = require 'fs'
AbstractService = require './AbstractService'

module.exports = (dependencies) ->

  {mongoose} = dependencies
  {promise} = dependencies.lib 'promises'
  NotFoundError = dependencies.lib 'errors/NotFoundError'
  ImageProcessor = dependencies.lib 'ImageProcessor'
  hashes = dependencies.lib 'hashes'
  Sequence = mongoose.model 'Sequence'
  Thread = mongoose.model 'Thread'
  Post = mongoose.model 'Post'

  class ThreadService extends AbstractService
    
    read: (query) -> promise (success, error) ->
      Thread
      .find(board: String(query.board), id: Number(query.id), markedForDeletion: false)
      .exclude('firstPost', 'lastPost', 'posts.password')
      .limit(1)
      .run (err, threads) ->
        return error err if err
        return error new NotFoundError("thread not found") if not threads[0]
        thread = threads[0]
        for post in thread.posts
          post.board = thread.board
        success threads[0]
    
    create: (data) ->
      Sequence.next(data.thread.board).then (seq) =>
        @_processImage(data.image, data.thread.board, seq.counter).then (image) =>
          post = @_post data.post, seq.counter, image
          thread = @_thread data.thread, post
          
          promise (success, error) =>
            thread.save (err) =>
              return error err if err
              success thread
    
    update: (data) ->
      Sequence.next(data.thread.board).then (seq) =>
        @_processImage(data.image, data.thread.board, seq.counter).then (image) =>
          post = @_post data.post, seq.counter, image
          Thread.addReply(data.thread.board, data.thread.id, post).then(
            (thread) ->
              thread.lastPost = post
              thread
          )
    
    _processImage: (image, board, id) ->
      processor = new ImageProcessor image, board, id
      processor.process()
    
    _post: (data, id, image) ->
      data.id = id
      data.image = image?.toJSON()
      data.password =
        if (data.password? and String(data.password).length > 0)
          hashes.sha1 data.password
        else null
      
      new Post(data).toJSON()
    
    _thread: (data, post) ->
      data.id = post.id
      data.updated = post.date
      data.firstPost = post
      thread = new Thread data
      thread.posts.push post
      thread
