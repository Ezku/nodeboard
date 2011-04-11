module.exports = (mongoose) ->
  ImageSchema = require('./ImageSchema.js')(mongoose).definition
  
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
      password: String
      image:
        type: ImageSchema
        required: false
  
  PostSchema