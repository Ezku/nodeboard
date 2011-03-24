(function() {
  module.exports = function(mongoose) {
    var Post, Thread;
    Post = mongoose.model('Post');
    return Thread = new mongoose.Schema({
      id: Number,
      topic: String,
      posts: [Post]
    });
  };
}).call(this);
