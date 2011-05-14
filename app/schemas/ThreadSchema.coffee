module.exports = (mongoose, dependencies) ->
  {config} = dependencies
  {promise} = dependencies.lib 'promises'
  PostSchema = require('./PostSchema.js')(mongoose, dependencies).definition
  
  ThreadSchema =
    definition:
      board:
        type: String
        index: true
        required: true
      id:
        type: Number
        index: true
        required: true
      updated:
        type: Date
        index: true
        required: true
      markedForDeletion:
        type: Boolean
        index: true
        required: true
        default: false
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
        Thread.collection.findAndModify {
            board: String(board),
            id: Number(id),
            markedForDeletion: false,
            replyCount: { $lt: config.content.maximumReplyCount }
          },
          [],
          { $push: { posts: post }, $set: { lastPost: post, updated: post.date }, $inc: { replyCount: 1 } },
          { new: false, upsert: false },
          (err, thread) ->
            return error err if err
            success thread
  
  ThreadSchema