fs = require 'fs'
_ = require 'underscore'
AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->
  {mongoose, imagemagick, config} = dependencies
  
  Sequence = mongoose.model 'Sequence'
  Thread = mongoose.model 'Thread'
  Post = mongoose.model 'Post'
  Image = mongoose.model 'Image'

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
    
    _processImage: (data, board, id, error, success) ->
      return success() if not data
      
      imagemagick.identify data.path, (err, features) =>
        return error err if err
        if _.indexOf(@allowedImageTypes, features.format) is -1
          return error new Error("image type #{features.format} not allowed")
        
        imagePath = @_getImagePath board
        image = @_getImageModel(data, features, id)
        imagemagick.resize @_getResizeOptions(imagePath, data, image),
          (err, stdout, stderr) ->
            return error err if err            
            fs.rename data.path, imagePath + image.fullsize, (err) ->
              return error err if err
              success image
    
    _getResizeOptions: (imagePath, data, image) ->
      resizeOptions =
        srcPath: data.path
        dstPath: imagePath  + image.thumbnail
      maxWidth = @_getThumbnailWidth()
      maxHeight = @_getThumbnailHeight()
      
      if image.width > maxWidth
        resizeOptions.width = maxWidth
      if image.height > maxHeight
        resizeOptions.height = maxHeight
      resizeOptions
    
    _getImageModel: (data, features, id) ->
        new Image
          name: data.name
          width: features.width
          height: features.height
          fullsize: @_getFullsizeName(features.format, id)
          thumbnail: @_getThumbnailName(features.format, id)
    
    _getImagePath: (board) ->
      path = config.paths.mount + board + "/"
      try
        fs.statSync(path)
      catch e
        fs.mkdirSync(path, 0777)
      path
    _getFullsizeName: (format, id) -> "#{id}.#{format.toLowerCase()}"
    _getThumbnailName: (format, id) -> "#{id}.thumb.#{format.toLowerCase()}"
    _getThumbnailHeight: -> config.images.thumbnail.height
    _getThumbnailWidth: -> config.images.thumbnail.width
    
    allowedImageTypes: ['JPEG', 'GIF', 'PNG']
    
    ###
    delete: (thread, error, success) ->
      Thread.delete { board: thread.board, id: thread.id },
        [],
        (err, result) ->
          return error err if err
          success()
    ###
