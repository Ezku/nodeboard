(function() {
  module.exports = function(mongoose) {
    var SequenceSchema;
    SequenceSchema = new mongoose.Schema({
      board: {
        type: String,
        unique: true
      },
      counter: {
        type: Number,
        "default": 1
      }
    });
    SequenceSchema.static({
      next: function(board, callback) {
        var Sequence;
        Sequence = mongoose.model('Sequence');
        return Sequence.collection.findAndModify({
          board: board
        }, [], {
          $inc: {
            counter: 1
          }
        }, {
          "new": true,
          upsert: true
        }, callback);
      }
    });
    return SequenceSchema;
  };
}).call(this);
