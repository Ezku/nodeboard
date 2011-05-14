module.exports = (dependencies) ->
  {mongoose, config, q, mersenne} = dependencies
  {promise} = dependencies.lib 'promises'
  images = dependencies.lib 'images'
  
  Thread = mongoose.model 'Thread'
  Tracker = mongoose.model 'Tracker'
  
  markExpiredThreads = (board) -> promise (success, error) ->
    Thread
    .where(markedForDeletion: false)
    .update(markedForDeletion: true)
    .sort('updated', -1)
    .skip(config.content.maximumThreadAmount)
    .run (err, threads) ->
      return error err if err
      success threads
  
  sweepPosts = (thread) ->
    promises = for post in thread.posts
      images.deleteByPost thread.board, post
      sweepTrackers thread
    q.join promises...
  
  sweepTrackers = (thread) -> promise (success, error) ->
    Tracker
    .delete()
    .where(board: thread.board, thread: thread.id)
    .run (err) ->
      return error err if err
      success()
  
  deleteExpiredThreads = (board) ->
    markExpiredThreads(board).then (threads) ->
      promises = for thread in threads
        sweepPosts(thread).then ->
          thread.remove()
          promise (success) ->
            success thread
      q.join promises...
  
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
    deleteExpiredThreads req.params.board
    if shouldCheckOrphanedTrackers()
      checkOrphanedTrackers req.params.board
  
  { upkeep }