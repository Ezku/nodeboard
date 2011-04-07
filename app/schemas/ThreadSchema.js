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
        firstPost: PostSchema,
        lastPost: PostSchema,
        posts: [new mongoose.Schema(PostSchema)]
      }
    };
    return ThreadSchema;
  };
}).call(this);
