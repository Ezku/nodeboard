aws = require './aws'
Promise = require 'bluebird'
gm = require 'gm'
path = require 'path'

identifyImage = do ->
  (path) -> new Promise (success, error) =>
    gm(path)
      .options(imageMagick: true)
      .identify (err, features) =>
        return error new Error "failed to identify image type" if err
        success {
          path: features.path
          format: features.format
          width: features.size.width
          height: features.size.height
        }

assertHasAllowedImageType = (features) ->
  allowedImageTypes = ['JPEG', 'GIF', 'PNG']
  if features.format not in allowedImageTypes
    throw new Error("image type #{features.format} not allowed")
  else
    features

createResizedThumbnail = ({gmimage, width, height, maxWidth, maxHeight}) ->
  new Promise (success, error) ->
    destination = gmimage.source + '.thumb'
    width = Math.min maxWidth, width
    height = Math.min maxHeight, height
    
    # Create thumbnail
    gmimage
      .options(imageMagick: true)
      .resize(width, height)
      .write destination, (err) ->
        return error err if err
        success destination

getResizableImage = (source, format) ->
  if format is 'GIF'
    # Need to coalesce gif frames or the animation will be fucked when resized
    gm("#{source}").coalesce()
  else
    gm(source)

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
          identifyImage(image.path)
            .then(assertHasAllowedImageType)
            .then (features) ->
              thumbnail = createResizedThumbnail({
                  gmimage: getResizableImage(image.path, features.format)
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
