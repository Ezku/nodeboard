(function() {
  module.exports = function(mongoose) {
    var TrackerSchema;
    TrackerSchema = {
      definition: {
        board: String,
        thread: Number,
        post: Number,
        date: {
          type: Date
        },
        ipHash: String,
        imageHash: String
      }
    };
    return TrackerSchema;
  };
}).call(this);
