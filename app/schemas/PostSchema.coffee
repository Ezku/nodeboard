module.exports = (mongoose) ->
  PostSchema =
    definition:
      id: Number
      date:
        type: Date
        default: Date.now
      author:
        type: String
        default: "Anonymous"
      content: String
      password: String
  
  PostSchema