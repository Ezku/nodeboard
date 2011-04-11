module.exports = (mongoose) ->
  ImageSchema =
    definition:
      name: String
      fullsize: String
      thumbnail: String
      width: Number
      height: Number
  
  ImageSchema