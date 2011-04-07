(function() {
  module.exports = function(mongoose) {
    var PostSchema;
    PostSchema = {
      definition: {
        id: Number,
        content: String,
        password: String
      }
    };
    return PostSchema;
  };
}).call(this);
