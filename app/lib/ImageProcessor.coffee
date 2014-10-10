aws = require './aws'
Promise = require 'bluebird'
imagemagick = require 'imagemagick'
path = require 'path'

identifyImage = do ->
  allowedImageTypes = ['JPEG', 'GIF', 'PNG']

  (path) -> new Promise (success, error) =>
    imagemagick.identify path, (err, features) =>
      return error new Error "failed to identify image type" if err
      if features.format not in allowedImageTypes
        return error new Error("image type #{features.format} not allowed")
      success features

createResizedThumbnail = ({source, width, height, maxWidth, maxHeight}) -> new Promise (success, error) ->
  options =
    srcPath: source
    dstPath: source + '.thumb'
    width: Math.min maxWidth, width
    height: Math.min maxHeight, height
  
  # Create thumbnail
  imagemagick.resize options, (err, stdout, stderr) =>          
    return error err if err
    success options.dstPath

uploadToS3 = (type, filepath, board, id) ->
  aws.upload type, filepath, "#{board}/#{id}/#{path.basename filepath}"

module.exports = (dependencies) ->
  {mongoose, config} = dependencies
  {promise} = dependencies.lib 'promises'
  Image = mongoose.model 'Image'
  
  ImageProcessor = (image, board, id) ->
    process:
      if not image
        -> Promise.resolve()
      else
        ->
          identifyImage(image.path).then (features) ->
            thumbnail = createResizedThumbnail({
                source: image.path
                width: features.width
                height: features.height
                maxWidth: config.images.thumbnail.width
                maxHeight: config.images.thumbnail.height
              }).then (thumbnailPath) ->
                uploadToS3(image.type, thumbnailPath, board, id)

            Promise.all([
              uploadToS3(image.type, image.path, board, id)
              thumbnail.catch(-> false)
            ]).spread (fullsize, thumbnail) ->
              new Image {
                name: image.name
                width: features.width
                height: features.height
                fullsize: fullsize
                thumbnail: thumbnail
              }
