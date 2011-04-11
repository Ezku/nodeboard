module.exports = (mongoose) ->
  
  PostSchema = require('./PostSchema.js')(mongoose).definition
  
  ThreadSchema =
    definition:
      # TODO: use namespaces instead of a field!
      board:
        type: String
        index: true
        required: true
      id:
        type: Number
        index: true
        required: true
      replyCount:
        type: Number
        default: 0
      firstPost:
        type: PostSchema
        required: true
      lastPost:
        type: PostSchema
        required: false
      posts: [new mongoose.Schema PostSchema]
  
  ThreadSchema