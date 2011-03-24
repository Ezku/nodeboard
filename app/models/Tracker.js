(function() {
  module.exports = function(mongoose) {
    var Tracker;
    return Tracker = new mongoose.Schema({
      thread: mongoose.Schema.ObjectId,
      post: Number,
      ip: String
    });
  };
}).call(this);
