(function() {
  module.exports = function(mongoose, dependencies) {
    var PostSchema, ThreadSchema, promise;
    promise = dependencies.lib('promises').promise;
    PostSchema = require('./PostSchema.js')(mongoose).definition;
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
              id: Number(id)
            }, [], {
              $push: {
                posts: post
              },
              $set: {
                lastPost: post
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
