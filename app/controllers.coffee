module.exports = (dependencies) ->
  {app, config, services} = dependencies
  
  # Retrieves a service object instance
  service = services.get
  
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
    service('Board').read req.params,
      next,
      (threads) ->
        res.render 'board',
          board: board
          threads: threads
          title: "/#{board}/ - #{name}"
  
  # Creating a new thread
  app.post '/:board/', validateBoard, (req, res, next) ->
    service('Thread').create { thread: req.params, post: req.body },
      next,
      (thread) ->
        res.redirect "/#{req.params.board}/#{thread.toJSON().id}/"
  
  # Thread view
  app.get '/:board/:thread/', validateBoard, (req, res, next) ->
    service('Thread').read { board: req.params.board, id: req.params.thread },
      next,
      (thread) ->
        res.render 'thread',
          board: req.params.board
          thread: thread.toJSON()
          title: "/#{req.params.board}/#{req.params.thread}"
  
  # Replying to a thread
  app.post '/:board/:thread/', validateBoard, (req, res, next) ->
    service('Thread').update { board: req.params.board, id: req.params.thread, post: req.body },
      next,
      (thread) ->
        res.redirect 'back'
  