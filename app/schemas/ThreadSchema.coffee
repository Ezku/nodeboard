Promise = require 'bluebird'

module.exports = (mongoose, dependencies) ->
  {config} = dependencies
  PostSchema = require('./PostSchema')(mongoose, dependencies).definition
  
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
      sweep: (board, threadLimit) ->
        new Promise((success, error) ->
          Thread = mongoose.model 'Thread'
          Thread
          .where(board: board, markedForDeletion: false)
          .sort('updated', -1)
          .skip(threadLimit)
          .run (err, threads) ->
            return error err if err
            success threads
        ).then (threads) ->
          return threads if !threads.length
          new Promise (success, error) ->
            Thread.update {
                id: {$in: (Number(thread.id.toString()) for thread in threads)}
              }, {
                markedForDeletion: true
              },
              (err) ->
                return error err if err
                success threads
          
      addReply: (board, id, post) -> new Promise (success, error) ->
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
            # The thread does not exist, it is marked for deletion, or the maximum reply count has been reached
            return error err if err
            # Everything went fine _b
            success thread
  
  ThreadSchema