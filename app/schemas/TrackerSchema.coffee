module.exports = (mongoose) ->
  
  TrackerSchema =
    definition:
      board: String
      id: Number
      date:
        type: Date
      contentHash: String
      imageHash: String
  
  TrackerSchema