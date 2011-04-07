module.exports = (dependencies) ->
  {app, models, config, models} = dependencies
  {Thread, Post} = models
  {Board} = dependencies.services
  
  # Checks for existence of board by its short name
  boardExists = (board) ->
    for group, boards of config.boards
      return true if boards[board]?
    return false
  
  # Get board name from configuration by its short name
  getBoardName = (board) ->
    for group, boards of config.boards
      return boards[board].name if boards[board]?
    return false
  
  # Middleware filter that asserts for existence of a board by a name given in the request
  validateBoard = (req, res, next) ->
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
  app.get '/:board/', validateBoard, (req, res, next) ->
    board = req.params.board
    name = getBoardName board
    boardService = new Board
    boardService.read board,
      (threads) -> res.render 'board',
        board: board
        threads: threads
        title: "/#{board}/ - #{name}"
      (err) -> next err
  
  # Creating a new thread
  app.post '/:board/', validateBoard, (req, res, next) ->
    thread = new Thread
      board: req.params.board
    thread.posts.add new Post
      content: req.body.content
      password: req.body.password
    thread.save {}, error: next, success: (thread) ->
      res.send thread.toJSON()