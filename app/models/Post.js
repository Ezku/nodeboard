(function() {
  module.exports = function(mongoose) {
    var Post;
    return Post = new mongoose.Schema({
      id: Number,
      content: String
    });
  };
}).call(this);
