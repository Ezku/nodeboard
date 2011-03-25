module.exports = (mongoose) ->
  Schema = mongoose.Schema
  ObjectId = mongoose.Schema.ObjectId
  
  TrackerSchema = new Schema
    thread: ObjectId
    post: Number
    ip: String