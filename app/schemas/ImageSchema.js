(function() {
  module.exports = function(mongoose) {
    var ImageSchema;
    ImageSchema = {
      definition: {
        name: String,
        path: String,
        thumbnail: String,
        mime: String,
        width: Number,
        height: Number
      }
    };
    return ImageSchema;
  };
}).call(this);
