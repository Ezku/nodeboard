module.exports = (mongoose) ->
  Tracker = new mongoose.Schema
    thread: mongoose.Schema.ObjectId
    post: Number
    ip: String