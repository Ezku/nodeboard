(function() {
  module.exports = function(mongoose) {
    var ObjectId, Schema, TrackerSchema;
    Schema = mongoose.Schema;
    ObjectId = mongoose.Schema.ObjectId;
    return TrackerSchema = new Schema({
      thread: ObjectId,
      post: Number,
      ip: String
    });
  };
}).call(this);
