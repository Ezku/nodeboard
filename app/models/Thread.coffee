module.exports = (mongoose, schemas) ->
  Schema = mongoose.Schema
  
  PostSchema = require('./Post.js')(mongoose)
  
  ThreadSchema = new Schema
    # TODO: use namespaces instead of a field!
    board:
      type: String
      index: true
    id:
      type: Number
      index: true
    # TODO: There's a race condition with latestPost - rework into a mongodb date if possible
    latestPost:
      type: Number
      index: true
    topic: String
    posts: [PostSchema]
  
  ThreadSchema.pre 'save', (next) ->
    if not @posts.length
      next new Error "A Thread cannot exist without Posts"
    else
      next()
  
  ThreadSchema.pre 'save', (next) ->
    return next() # TODO: no image support yet
    
    if @isNew and not @posts[0].image?
      next new Error "A Thread's first post cannot be missing an image"
    else
      next()
  
  ThreadSchema.static
    create: (options) ->
      {success, error, thread, post} = options
      
      Thread = mongoose.model 'Thread'
      Sequence = mongoose.model 'Sequence'

      Sequence.next
        error: error
        board: thread.board
        success: (seq) ->
          result = new Thread thread
          result.id = result.latestPost = post.id = seq.counter
          result.posts.push post
          result.save (err) ->
            return error err if err
            success result

    reply: (options) ->
      {success, error, board, id, post} = options
      
      Thread = mongoose.model 'Thread'
      Sequence = mongoose.model 'Sequence'
      
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
  
  ThreadSchema
  