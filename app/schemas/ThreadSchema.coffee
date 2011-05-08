module.exports = (mongoose, dependencies) ->
  {promise} = dependencies.lib 'promises'
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
    static:
      addReply: (board, id, post) -> promise (success, error) ->
        Thread = mongoose.model 'Thread'
        Thread.collection.findAndModify { board: String(board), id: Number(id) },
          [],
          { $push: { posts: post }, $set: { lastPost: post }, $inc: { replyCount: 1 } },
          { new: false, upsert: false },
          (err, thread) ->
            return error err if err
            success thread
  
  ThreadSchema