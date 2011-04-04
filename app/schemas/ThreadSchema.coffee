module.exports = (mongoose, schemas) ->
  Schema = mongoose.Schema
  
  PostSchema = require('./PostSchema.js')(mongoose)
  
  ThreadSchema = new Schema
    # TODO: use namespaces instead of a field!
    board:
      type: String
      index: true
    id:
      type: Number
      index: true
    # TODO: There's a race condition with latestPost - rework into a mongodb date if possible
    latestPost:
      type: Number
      index: true
    posts: [PostSchema]
  
  ThreadSchema
  