(function() {
  module.exports = function(mongoose) {
    var PostSchema;
    PostSchema = {
      definition: {
        id: Number,
        date: {
          type: Date,
          "default": Date.now
        },
        author: {
          type: String,
          "default": "Anonymous"
        },
        content: String,
        password: String
      }
    };
    return PostSchema;
  };
}).call(this);
