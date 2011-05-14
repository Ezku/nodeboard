(function() {
  module.exports = function(mongoose, dependencies) {
    var PostSchema, ThreadSchema, config, promise;
    config = dependencies.config;
    promise = dependencies.lib('promises').promise;
    PostSchema = require('./PostSchema.js')(mongoose, dependencies).definition;
    ThreadSchema = {
      definition: {
        board: {
          type: String,
          index: true,
          required: true
        },
        id: {
          type: Number,
          index: true,
          required: true
        },
        updated: {
          type: Date,
          index: true,
          required: true
        },
        markedForDeletion: {
          type: Boolean,
          index: true,
          required: true,
          "default": false
        },
        replyCount: {
          type: Number,
          "default": 0
        },
        firstPost: {
          type: PostSchema,
          required: true
        },
        lastPost: {
          type: PostSchema,
          required: false
        },
        posts: [new mongoose.Schema(PostSchema)]
      },
      static: {
        addReply: function(board, id, post) {
          return promise(function(success, error) {
            var Thread;
            Thread = mongoose.model('Thread');
            return Thread.collection.findAndModify({
              board: String(board),
              id: Number(id),
              markedForDeletion: false,
              replyCount: {
                $lt: config.content.maximumReplyCount
              }
            }, [], {
              $push: {
                posts: post
              },
              $set: {
                lastPost: post,
                updated: post.date
              },
              $inc: {
                replyCount: 1
              }
            }, {
              "new": false,
              upsert: false
            }, function(err, thread) {
              if (err) {
                return error(err);
              }
              return success(thread);
            });
          });
        }
      }
    };
    return ThreadSchema;
  };
}).call(this);
