module.exports = (mongoose) ->
  PostSchema =
    definition:
      id: Number
      content: String
      password: String
  
  PostSchema