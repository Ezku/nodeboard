(function() {
  module.exports = function(mongoose) {
    var Schema, SequenceSchema;
    Schema = mongoose.Schema;
    SequenceSchema = new Schema({
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
      next: function(options) {
        var Sequence, board, error, success;
        success = options.success, error = options.error, board = options.board;
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
        }, function(err, result) {
          if (err) {
            return error(err);
          }
          return success(result);
        });
      }
    });
    return SequenceSchema;
  };
}).call(this);
