module.exports = (mongoose, dependencies) ->
  ImageSchema = require('./ImageSchema.js')(mongoose).definition
  hashes = dependencies.lib 'hashes'
  
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
            hashes.sha1 password
          else
            null
      image:
        type: ImageSchema
        required: false
    
  
  PostSchema