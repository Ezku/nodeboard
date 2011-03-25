(function() {
  module.exports = function(mongoose) {
    var PostSchema, Schema;
    Schema = mongoose.Schema;
    PostSchema = new Schema({
      id: Number,
      content: String,
      password: String
    });
    PostSchema.method({
      hasImage: function() {
        return true;
      }
    });
    return PostSchema;
  };
}).call(this);
