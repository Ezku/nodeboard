(function() {
  module.exports = function(mongoose, dependencies) {
    var ImageSchema, PostSchema;
    ImageSchema = require('./ImageSchema.js')(mongoose).definition;
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
        password: {
          type: String
        },
        image: {
          type: ImageSchema,
          required: false
        }
      }
    };
    return PostSchema;
  };
}).call(this);
