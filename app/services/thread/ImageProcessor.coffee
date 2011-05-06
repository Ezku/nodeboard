_ = require 'underscore'
fs = require 'fs'
util = require 'util'

module.exports = (dependencies) ->
  {mongoose, imagemagick, config} = dependencies
  Image = mongoose.model 'Image'
  
  class ImageProcessor
    
    constructor: (@data, @board, @id) ->
      @imagePath = @getImagePath @board
    
    process: (error, success) ->
      return success() if not @data
      
      imagemagick.identify @data.path, (err, features) =>
        return error err if err
        if _.indexOf(@allowedImageTypes, features.format) is -1
          return error new Error("image type #{features.format} not allowed")
        
        image = @getImageModel(features)
        options = @getResizeOptions(image)
        imagemagick.resize options, (err, stdout, stderr) =>          
          return error err if err  
          @move data.path, imagePath + image.fullsize, error, ->
            success image
    
    getImageModel: (features) ->
      new Image
        name: @data.name
        width: features.width
        height: features.height
        fullsize: @getFullsizeName(features.format)
        thumbnail: @getThumbnailName(features.format)
    
    getResizeOptions: (image) ->
      resizeOptions =
        srcPath: @data.path
        dstPath: @imagePath  + image.thumbnail
      maxWidth = @getThumbnailWidth()
      maxHeight = @getThumbnailHeight()
      
      if image.width > maxWidth
        resizeOptions.width = maxWidth
      if image.height > maxHeight
        resizeOptions.height = maxHeight
      resizeOptions
    
    getImagePath: (board) ->
      path = config.paths.mount + board + "/"
      try
        fs.statSync(path)
      catch e
        fs.mkdirSync(path, 0777)
      path
    
    getFullsizeName: (format) -> "#{@id}.#{format.toLowerCase()}"
    getThumbnailName: (format) -> "#{@id}.thumb.#{format.toLowerCase()}"
    getThumbnailHeight: -> config.images.thumbnail.height
    getThumbnailWidth: -> config.images.thumbnail.width
    
    # Move file from source path to destination. Supports moves from accross disk partitions.
    move: (source, destination, error, success) ->
      input = fs.createReadStream source
      output = fs.createWriteStream destination
      util.pump input, output, (err) ->
        fs.unlinkSync source
        return error err if err
        success()
    
    allowedImageTypes: ['JPEG', 'GIF', 'PNG']