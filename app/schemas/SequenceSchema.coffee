module.exports = (mongoose) ->
  SequenceSchema =
    definition:
      board: 
        type: String
        unique: true
      counter:
        type: Number
        default: 1
    static:
      next: (board, error, success) ->
        Sequence = mongoose.model('Sequence')
        Sequence.collection.findAndModify { board: board },
          [],
          {$inc: {counter: 1} },
          {new: true, upsert: true},
          (err, result) ->
            console.log ''
            return error err if err
            success result
  
  SequenceSchema