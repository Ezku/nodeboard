Promise = require 'bluebird'
AbstractService = require './AbstractService'

module.exports = (dependencies) ->
  {mongoose, config} = dependencies
  
  Thread = mongoose.model 'Thread'

  class BoardService extends AbstractService
    
    index: -> new Promise (success, error) ->
      Thread
      .find(markedForDeletion: false)
      .exclude('posts', 'firstPost.password', 'lastPost.password')
      .sort('updated', -1)
      .limit(config.content.threadsPerPage)
      .run (err, threads) ->
        return error err if err
        success threads
    
    read: (query) -> new Promise (success, error) ->
      limit = query.limit ? ((query.pages ? 1) * config.content.threadsPerPage)
      Thread
      .find(board: query.board, markedForDeletion: false)
      .exclude('posts', 'firstPost.password', 'lastPost.password')
      .sort('updated', -1)
      .limit(limit)
      .run (err, threads) ->
        return error err if err
        Thread
        .count(board: query.board, markedForDeletion: false)
        .run (err, count) ->
          return error err if err
          threads.total = count
          success threads