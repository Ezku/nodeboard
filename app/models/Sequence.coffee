module.exports = (mongoose) ->
  Schema = mongoose.Schema
  
  SequenceSchema = new Schema
    board: 
      type: String
      unique: true
    counter:
      type: Number
      default: 1
  
  SequenceSchema.static 
    next: (options) ->
      {success, error, board} = options
      Sequence = mongoose.model('Sequence')
      Sequence.collection.findAndModify { board: board },
        [],
        {$inc: {counter: 1} },
        {new: true, upsert: true},
        (err, result) ->
          return error err if err
          success result
  
  SequenceSchema