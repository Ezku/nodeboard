module.exports = (dependencies) ->
  {mongoose, config, q, mersenne} = dependencies
  {promise, all} = dependencies.lib 'promises'
  images = dependencies.lib 'images'
  
  Thread = mongoose.model 'Thread'
  Tracker = mongoose.model 'Tracker'
  
  sweepTrackers = (thread) -> promise (success, error) ->
    Tracker.remove board: thread.board, thread: thread.id, (err) ->
      return error err if err
      success()
  
  sweepPosts = (thread) ->
    promises = for post in thread.posts
      images.deleteByPost thread.board, post
      promise (success) -> success()
    all promises
  
  sweepThread = (thread) ->
    all([sweepPosts(thread), sweepTrackers(thread)]).then ->
      thread.remove()
      promise (success) ->
        success thread
  
  sweepThreads = (board) ->
    Thread.sweep(board, config.content.maximumThreadAmount).then (threads) ->
      promises = for thread in threads
        do (thread) ->
          sweepThread(thread)
      all promises
  
  findTrackedThreads = (board) -> promise (success, error) ->    
    Tracker
    .collection
    .distinct('thread', {
      board: board
    }, (err, threads) ->
      return error err if err
      success threads
    )
  
  threadExists = (board, id) -> promise (success, error) ->
    Thread
    .findOne({board, id})
    .run (err, thread) ->
      return error err if err
      success !!thread
  
  checkOrphanedTrackers = (board) ->
    findTrackedThreads(board).then (ids) ->
      for id in ids
        do (id) ->
          threadExists(board, id).then (doesExist) ->
            if not doesExist
              sweepTrackers {board, id}
  
  shouldCheckOrphanedTrackers = -> mersenne.rand(100) < config.content.orphanedTrackerCheckProbability
  
  upkeep = (req, res) ->
    sweepThreads req.params.board
    if shouldCheckOrphanedTrackers()
      checkOrphanedTrackers req.params.board
  
  { upkeep, sweepThread }