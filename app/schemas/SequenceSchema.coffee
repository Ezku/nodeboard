module.exports = (mongoose, dependencies) ->
  {promise} = dependencies.lib 'promises'

  SequenceSchema =
    definition:
      board: 
        type: String
        unique: true
      counter:
        type: Number
        default: 1
    static:
      next: (board) -> promise (success, error) ->
        Sequence = mongoose.model('Sequence')
        Sequence.collection.findAndModify { board: board },
          [],
          {$inc: {counter: 1} },
          {new: true, upsert: true},
          (err, result) ->
            return error err if err
            success result
  
  SequenceSchema