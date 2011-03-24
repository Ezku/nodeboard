module.exports = (mongoose) ->
  SequenceSchema = new mongoose.Schema
    board: 
      type: String
      unique: true
    counter:
      type: Number
      default: 1
  
  SequenceSchema.static next: (board, callback) ->
    Sequence = mongoose.model('Sequence')
    Sequence.collection.findAndModify { board: board },
      [],
      {$inc: {counter: 1} },
      {new: true, upsert: true},
      callback
  
  SequenceSchema