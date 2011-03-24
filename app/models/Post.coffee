module.exports = (mongoose) ->
  Post = new mongoose.Schema
    id: Number
    content: String