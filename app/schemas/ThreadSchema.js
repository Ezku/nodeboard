(function() {
  module.exports = function(mongoose) {
    var PostSchema, ThreadSchema;
    PostSchema = require('./PostSchema.js')(mongoose).definition;
    ThreadSchema = {
      definition: {
        board: {
          type: String,
          index: true
        },
        id: {
          type: Number,
          index: true
        },
        replyCount: {
          type: Number,
          "default": 0
        },
        firstPost: PostSchema,
        lastPost: PostSchema,
        posts: [new mongoose.Schema(PostSchema)]
      }
    };
    return ThreadSchema;
  };
}).call(this);
