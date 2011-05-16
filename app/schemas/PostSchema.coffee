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
        set: (password) ->
          return null if not password?
          password = String(password)
          if password.length > 0
            hashlib.sha1 password
          else
            null
      image:
        type: ImageSchema
        required: false
    
  
  PostSchema