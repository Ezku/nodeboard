Promise = require 'bluebird'

module.exports = (dependencies) ->
  {services} = dependencies
  {filter} = dependencies.lib 'promises'
  service = services.get
  boards = dependencies.lib 'boards'
  NotFoundError = dependencies.lib 'errors/NotFoundError'
  
  # Asserts for existence of a board by a name given in the request
  shouldHaveBoard = (req, res, next) ->
    board = req.params.board
    if board? and boards.exists board
      next()
    else
      next(new NotFoundError("Board '#{board}' does not exist"))
  
  # Asserts for existence of a thread by an id given in the request
  # NOTE: handleImageUpload does not work if this precedes it
  shouldHaveThread = filter (req) ->
    service('Thread')
      .read(req.params)
      .then(
        (v) -> v
        -> new NotFoundError "Thread #{Number(req.params.id)} does not exist"
      )
  
  { shouldHaveBoard, shouldHaveThread }