AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->
  {mongoose, config} = dependencies
  {promise} = dependencies.lib 'promises'
  
  Thread = mongoose.model 'Thread'

  class BoardService extends AbstractService
    
    read: (query) -> promise (success, error) ->
      limit = query.limit ? ((query.pages ? 1) * config.content.threadsPerPage)
      Thread
      .find(board: query.board)
      # TODO: Find out how to filter out unwanted output from posts
      .select('board', 'id', 'firstPost', 'lastPost', 'replyCount')
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