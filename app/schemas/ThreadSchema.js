(function() {
  module.exports = function(mongoose, schemas) {
    var PostSchema, Schema, ThreadSchema;
    Schema = mongoose.Schema;
    PostSchema = require('./PostSchema.js')(mongoose);
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
      posts: [PostSchema]
    });
    return ThreadSchema;
  };
}).call(this);
