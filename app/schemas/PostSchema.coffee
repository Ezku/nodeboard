module.exports = (mongoose, dependencies) ->
  ImageSchema = require('./ImageSchema.js')(mongoose).definition
  {hashlib} = dependencies
  
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
        set: (password) -> hashlib.sha1 password
      image:
        type: ImageSchema
        required: false
  
  PostSchema