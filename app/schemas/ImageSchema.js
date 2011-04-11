(function() {
  module.exports = function(mongoose) {
    var ImageSchema;
    ImageSchema = {
      definition: {
        name: String,
        fullsize: String,
        thumbnail: String,
        width: Number,
        height: Number
      }
    };
    return ImageSchema;
  };
}).call(this);
