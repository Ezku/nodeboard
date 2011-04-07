module.exports = (mongoose) ->
  
  PostSchema = require('./PostSchema.js')(mongoose).definition
  
  ThreadSchema =
    definition:
      # TODO: use namespaces instead of a field!
      board:
        type: String
        index: true
      id:
        type: Number
        index: true
        
      # FIXME: Mongoose doesn't adhere to this
      firstPost: PostSchema
      # FIXME: Mongoose doesn't adhere to this
      lastPost: PostSchema
      posts: [new mongoose.Schema PostSchema]
  
  ThreadSchema