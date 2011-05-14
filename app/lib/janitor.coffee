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
      sweepTrackers thread
    all promises
  
  sweepThreads = (board) ->
    Thread.sweep(board, config.content.maximumThreadAmount).then (threads) ->
      promises = for thread in threads
        sweepPosts(thread).then ->
          thread.remove()
          promise (success) ->
            success thread
      all promises
  
  findTrackedThreads = (board) -> promise (success, error) ->    
    Tracker
    .collection
    .distinct('thread', {
      board: board
    }, (err, trackers) ->
      return error err if err
      success (tracker.thread for tracker in trackers)
    )
  
  threadExists = (board, id) -> promise (success, error) ->
    Thread
    .find({board, id})
    .run (err, thread) ->
      return error err if err
      success !!thread
  
  checkOrphanedTrackers = (board) ->
    findTrackedThreads(board).then (ids) ->
      for id in ids
        threadExists(board, id).then (doesExist) ->
          if not doesExist
            sweepTrackers {board: board, thread: id}
  
  shouldCheckOrphanedTrackers = -> mersenne.rand(100) < config.content.orphanedTrackerCheckProbability
  
  upkeep = (req, res) ->
    sweepThreads req.params.board
    if shouldCheckOrphanedTrackers()
      checkOrphanedTrackers req.params.board
  
  { upkeep }