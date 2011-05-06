(function() {
  module.exports = function(mongoose) {
    var TrackerSchema;
    TrackerSchema = {
      definition: {
        board: String,
        id: Number,
        date: {
          type: Date
        },
        contentHash: String,
        imageHash: String
      }
    };
    return TrackerSchema;
  };
}).call(this);
