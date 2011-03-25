(function() {
  module.exports = function(mongoose, schemas) {
    var PostSchema, Schema, ThreadSchema;
    Schema = mongoose.Schema;
    PostSchema = require('./Post.js')(mongoose);
    ThreadSchema = new Schema({
      board: {
        type: String,
        index: true
      },
      id: {
        type: Number,
        index: true
      },
      latestPost: {
        type: Number,
        index: true
      },
      topic: String,
      posts: [PostSchema]
    });
    ThreadSchema.pre('save', function(next) {
      if (!this.posts.length) {
        return next(new Error("A Thread cannot exist without Posts"));
      } else {
        return next();
      }
    });
    ThreadSchema.pre('save', function(next) {
      return next();
      if (this.isNew && !(this.posts[0].image != null)) {
        return next(new Error("A Thread's first post cannot be missing an image"));
      } else {
        return next();
      }
    });
    ThreadSchema.static({
      create: function(options) {
        var Sequence, Thread, error, post, success, thread;
        success = options.success, error = options.error, thread = options.thread, post = options.post;
        Thread = mongoose.model('Thread');
        Sequence = mongoose.model('Sequence');
        return Sequence.next({
          error: error,
          board: thread.board,
          success: function(seq) {
            var result;
            result = new Thread(thread);
            result.id = result.latestPost = post.id = seq.counter;
            result.posts.push(post);
            return result.save(function(err) {
              if (err) {
                return error(err);
              }
              return success(result);
            });
          }
        });
      },
      reply: function(options) {
        var Sequence, Thread, board, error, id, post, success;
        success = options.success, error = options.error, board = options.board, id = options.id, post = options.post;
        Thread = mongoose.model('Thread');
        Sequence = mongoose.model('Sequence');
        return Sequence.next({
          error: error,
          board: board,
          success: function(seq) {
            post.id = seq.counter;
            return Thread.collection.findAndModify({
              board: board,
              id: id
            }, [], {
              $push: {
                posts: post
              },
              latestPost: seq.counter
            }, {
              "new": false,
              upsert: false
            }, function(err, thread) {
              if (err) {
                return error(err);
              }
              return success(thread);
            });
          }
        });
      }
    });
    return ThreadSchema;
  };
}).call(this);
