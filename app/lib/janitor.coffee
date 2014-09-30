Promise = require 'bluebird'

module.exports = (dependencies) ->
  {mongoose, config, q, mersenne} = dependencies
  {promise, all, succeed} = dependencies.lib 'promises'
  images = dependencies.lib 'images'
  
  Thread = mongoose.model 'Thread'
  Tracker = Promise.promisifyAll mongoose.model 'Tracker'
  
  sweepTrackers = (thread) ->
    Tracker.removeAsync {
      board: thread.board
      thread: thread.id
    }
  
  sweepPosts = (thread) ->
    Promise.all (
      for post in thread.posts
        images.deleteByPost(thread.board, post)
    )
  
  sweepThread = (thread) ->
    Promise.join(
      sweepPosts(thread)
      sweepTrackers(thread)
    ).then ->
      thread.remove()
      thread
  
  sweepThreads = (board) ->
    Thread.sweep(board, config.content.maximumThreadAmount).then (threads) ->
      Promise.all (
        for thread in thread
          sweepThread thread
      )
  
  findTrackedThreads = (board) -> new Promise (success, error) ->    
    Tracker
    .collection
    .distinct('thread', {
      board: board
    }, (err, threads) ->
      return error err if err
      success threads
    )
  
  threadExists = (board, id) -> new Promise (success, error) ->
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