(function() {
  module.exports = function(mongoose) {
    var PostSchema, Schema;
    Schema = mongoose.Schema;
    PostSchema = new Schema({
      id: Number,
      content: String,
      password: String
    });
    return PostSchema;
  };
}).call(this);
