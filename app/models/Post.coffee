module.exports = (mongoose) ->
  Schema = mongoose.Schema
  
  PostSchema = new Schema
    id: Number
    content: String
    password: String
  
  PostSchema.method hasImage: -> true
  
  PostSchema