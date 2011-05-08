(function() {
  module.exports = function(mongoose, dependencies) {
    var SequenceSchema, promise;
    promise = dependencies.lib('promises').promise;
    SequenceSchema = {
      definition: {
        board: {
          type: String,
          unique: true
        },
        counter: {
          type: Number,
          "default": 1
        }
      },
      static: {
        next: function(board) {
          return promise(function(success, error) {
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
            }, function(err, result) {
              if (err) {
                return error(err);
              }
              return success(result);
            });
          });
        }
      }
    };
    return SequenceSchema;
  };
}).call(this);
