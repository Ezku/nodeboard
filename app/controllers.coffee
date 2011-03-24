module.exports = (dependencies) ->
  {app, mongoose, config} = dependencies
  
  Sequence = mongoose.model 'Sequence'
  
  # Checks for existence of board by its short name
  boardExists = (board) ->
    for group, boards of config.boards
      return true if boards[board]?
    return false
  
  # Middleware filter that asserts for existence of a board by a name given in the request
  boardMustExist = (req, res, next) ->
    board = req.params.board
    if board? and boardExists board
      next()
    else
      next(new Error("Board '#{board}' does not exist"))
  
  # Front page
  app.get '/', (req, res) ->
    res.render 'index',
      title: 'Aaltoboard'
  
  # Board index
  app.get '/:board/', boardMustExist, (req, res, next) ->
    Sequence.next req.params.board, (error, seq) ->
      return next(error) if error
      res.render 'board',
        board: req.params.board
        counter: seq.counter
  
  