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
        sweep: function(board, threadLimit) {
          return promise(function(success, error) {
            var Thread;
            Thread = mongoose.model('Thread');
            return Thread.where({
              board: board,
              markedForDeletion: false
            }).sort('updated', -1).skip(threadLimit).run(function(err, threads) {
              var thread;
              if (err) {
                return error(err);
              }
              if (!threads.length) {
                return success([]);
              } else {
                return Thread.update({
                  id: {
                    $in: (function() {
                      var _i, _len, _results;
                      _results = [];
                      for (_i = 0, _len = threads.length; _i < _len; _i++) {
                        thread = threads[_i];
                        _results.push(Number(thread.id.toString()));
                      }
                      return _results;
                    })()
                  }
                }, {
                  markedForDeletion: true
                }, function(err) {
                  if (err) {
                    return error(err);
                  }
                  return success(threads);
                });
              }
            });
          });
        },
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
