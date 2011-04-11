module.exports = (mongoose) ->
  ImageSchema =
    definition:
      name: String
      path: String
      thumbnail: String
      mime: String
      width: Number
      height: Number
  
  ImageSchema