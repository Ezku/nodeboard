module.exports = (mongoose) ->
  Post = mongoose.model 'Post'
  
  Thread = new mongoose.Schema
    id: Number
    topic: String
    posts: [Post]