(function() {
  module.exports = function(mongoose, dependencies) {
    var ImageSchema, PostSchema, hashes;
    ImageSchema = require('./ImageSchema.js')(mongoose).definition;
    hashes = dependencies.lib('hashes');
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
            if (!(password != null)) {
              return null;
            }
            password = String(password);
            if (password.length > 0) {
              return hashes.sha1(password);
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
