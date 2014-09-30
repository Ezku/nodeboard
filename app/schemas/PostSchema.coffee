module.exports = (mongoose, dependencies) ->
  ImageSchema = require('./ImageSchema')(mongoose).definition
  
  PostSchema =
    definition:
      id: Number
      date:
        type: Date
        default: Date.now
      author:
        type: String
        default: "Anonymous"
      content: String
      password:
        type: String
      image:
        type: ImageSchema
        required: false
  
  PostSchema