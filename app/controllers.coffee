module.exports = (dependencies) ->
  {app, config, services, formidable} = dependencies
  
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
  
  # Asserts for existence of a board by a name given in the request
  validateBoard = (req, res, next) ->
    board = req.params.board
    if board? and boardExists board
      next()
    else
      next(new Error("Board '#{board}' does not exist"))
  
  # Asserts for existence of a thread by an id given in the request
  # NOTE: handleImageUpload does not work if this precedes it
  validateThread = (req, res, next) ->
    service('Thread').read req.params,
      next,
      ->
        next()
  
  # Declare a set of parameters that can be accepted in the request body 
  accept = (params...) -> (req, res, next) ->
    input = req.body
    accepted = {}
    accepted[name] = input[name] for name in params
    req.body = accepted
    do next
  
  # Parses images uploaded in the request and stores them in the request object
  handleImageUpload = (req, res, next) ->
    form = new formidable.IncomingForm()
    form.uploadDir = config.paths.temp
    form.parse req, (err, fields, files) ->
      return next err if err
      # The regular body vanishes, reassign it
      req.body = fields
      # Assign valid image files to request
      req.files = {}
      for name, file of files when file.type?.match('^image')
        req.files[name] = file
      next()
  
  collectBoard = (collector) -> [
    validateBoard,
    (req, res, next) ->
      service('Board').read req.params,
        next,
        (threads) ->
          collector 'view', 'board'
          collector 'threads', threads
          next()
  ]
  
  collectThread = (collector) -> [
    validateThread,
    (req, res, next) ->
      service('Thread').read req.params,
        next,
        (thread) ->
          collector 'view', 'thread'
          collector 'thread', thread
          next()
  ]
  
  # Builds a data accumulator function with three behaviours
  # f(): returns accumulated data as an object
  # f(key): returns the value associated with the key if any
  # f(key, value): associates key with value
  collector = ->
    data = {}
    (key, value) ->
      return data if not key?
      return data[key] if not value?
      data[key] = value
  
  # Collects data for the overview panel
  overview = collector()
  
  # Collects data for the detail panel
  detail = collector()
  
  # Renders the panels view with data from the overview and detail data accumulators
  renderPanels = (req, res, next) ->
    res.render 'panels',
      overview: overview()
      detail: detail()
  
  # Front page
  app.get '/',
    (req, res, next) ->
      overview 'view', 'index'
      overview 'title', 'Aaltoboard'
      res.local 'title', 'Aaltoboard'
      next()
    renderPanels
  
  # Board index
  app.get '/:board/',
    collectBoard overview,
    (req, res, next) ->
      board = req.params.board
      name = getBoardName board
      boardTitle = "/#{board}/ - #{name}"
      
      overview 'board', board
      overview 'title', boardTitle
      res.local 'title', boardTitle
      next()
    renderPanels
  
  # Creating a new thread
  app.post '/:board/',
    validateBoard,
    handleImageUpload,
    accept('content', 'password'),
    (req, res, next) ->
      service('Thread').create { thread: req.params, post: req.body, image: req.files?.image },
        next,
        (thread) ->
          res.redirect "/#{req.params.board}/#{thread.toJSON().id}/"
  
  # Thread view
  app.get '/:board/:id/',
    collectBoard overview,
    collectThread detail,
    (req, res, next) ->
      board = req.params.board
      name = getBoardName req.params.board
      boardTitle = "/#{board}/ - #{name}"
      threadTitle = "/#{board}/#{req.params.id}"
      
      overview 'board', board
      overview 'title', boardTitle
      detail 'title', threadTitle
      res.local 'title', threadTitle
    renderPanels
  
  # Replying to a thread
  app.post '/:board/:id/',
    validateBoard,
    handleImageUpload,
    validateThread,
    accept('content', 'password'),
    (req, res, next) ->
      service('Thread').update { thread: req.params, post: req.body, image: req.files?.image },
        next,
        (thread) ->
          res.redirect 'back'
  