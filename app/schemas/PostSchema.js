(function() {
  module.exports = function(mongoose, dependencies) {
    var ImageSchema, PostSchema, hashlib;
    ImageSchema = require('./ImageSchema.js')(mongoose).definition;
    hashlib = dependencies.hashlib;
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
          type: String,
          set: function(password) {
            password = String(password);
            if (password.length > 0) {
              return hashlib.sha1(password);
            } else {
              return null;
            }
          }
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
