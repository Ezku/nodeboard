module.exports = (mongoose) ->
  
  TrackerSchema =
    definition:
      board: String
      thread: Number
      post: Number
      date:
        type: Date
      ipHash: String
      imageHash: String
  
  TrackerSchema