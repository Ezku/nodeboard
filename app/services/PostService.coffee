module.exports = (dependencies) ->
  {mongoose} = dependencies
  
  Thread = mongoose.model 'Thread'
  Sequence = mongoose.model 'Sequence'
  
  class PostService
    
    create: (data, success, error) ->
      {board, id, post} = data

      Sequence.next
        error: error
        board: board
        success: (seq) ->
          post.id = seq.counter
          Thread.collection.findAndModify {board: board, id: id},
              [],
              { $push: { posts: post }, latestPost: seq.counter },
              {new: false, upsert: false},
              (err, thread) ->
                return error err if err
                success thread