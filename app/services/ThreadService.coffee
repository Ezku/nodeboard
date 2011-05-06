
AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->

  {mongoose} = dependencies
  
  ImageProcessor = require('./thread/ImageProcessor.js')(dependencies)
  Sequence = mongoose.model 'Sequence'
  Thread = mongoose.model 'Thread'
  Post = mongoose.model 'Post'

  class ThreadService extends AbstractService
    
    create: (data, error, success) ->
      Sequence.next data.thread.board,
        error,
        (seq) =>
          @_processImage data.image, data.thread.board, seq.counter, error, (image) ->
            thread = new Thread data.thread
            post = new Post(data.post).toJSON()
            post.image = image?.toJSON()
            thread.id = post.id = seq.counter
          
            thread.posts.push post
            thread.firstPost = post
          
            thread.save (err) ->
              return error err if err
              success thread
    
    read: (query, error, success) ->
      Thread
      .find(board: String(query.board), id: Number(query.id))
      .select('board', 'id', 'posts')
      .limit(1)
      .run (err, threads) ->
        return error err if err
        return error new Error("thread not found") if not threads[0]
        success threads[0]
    
    update: (data, error, success) ->
      Sequence.next data.thread.board,
        error,
        (seq) =>
          @_processImage data.image, data.thread.board, seq.counter, error, (image) ->
            post = new Post(data.post).toJSON()
            post.id = seq.counter
            post.image = image?.toJSON()
          
            Thread.collection.findAndModify { board: String(data.thread.board), id: Number(data.thread.id) },
              [],
              { $push: { posts: post }, $set: { lastPost: post }, $inc: { replyCount: 1 } },
              { new: false, upsert: false },
              (err, thread) ->
                return error err if err
                success thread
    
    _processImage: (image, board, id, error, success) ->
      processor = new ImageProcessor image, board, id
      processor.process error, success
    
    ###
    delete: (thread, error, success) ->
      Thread.delete { board: thread.board, id: thread.id },
        [],
        (err, result) ->
          return error err if err
          success()
    ###
