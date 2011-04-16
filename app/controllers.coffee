module.exports = (dependencies) ->
  {app, config, services, formidable, io} = dependencies
  
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
  
  # Front page
  app.get '/', (req, res) ->
    res.render 'index',
      title: 'Aaltoboard'
      id: "front-page"
      class: ""
  
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
          class: "board-page"
          id: "board-page-#{board}"
  
  # Creating a new thread
  app.post '/:board/', validateBoard, handleImageUpload, (req, res, next) ->
    service('Thread').create { thread: req.params, post: req.body, image: req.files?.image },
      next,
      (thread) ->
        socket.broadcast {thread: {board: thread.board, id: thread.id}}
        res.redirect "/#{req.params.board}/#{thread.toJSON().id}/"
  
  # Thread view
  app.get '/:board/:id/', validateBoard, (req, res, next) ->
    service('Thread').read req.params,
      next,
      (thread) ->
        service('Board').read req.params,
          next,
          (threads) ->
            res.render 'board',
              board: req.params.board
              threads: threads
              title: "/#{req.params.board}/ - #{getBoardName req.params.board}"
              class: "thread-page"
              id: "thread-page-#{req.params.id}"
              detailLevel: "thread"
              detailTitle: "/#{req.params.board}/#{req.params.id}"
              detailData: thread.toJSON()
  
  # Replying to a thread
  app.post '/:board/:id/', validateBoard, handleImageUpload, validateThread, (req, res, next) ->
    service('Thread').update { thread: req.params, post: req.body, image: req.files?.image },
      next,
      (thread) ->
        socket.broadcast {reply: {board: thread.board, thread: thread.id}}
        res.redirect 'back'
  
  # Socket io
  socket = io.listen app
  
  # Socket connection listeners
  socket.on 'connection', (client) ->
    console.log 'new client connection: ' + client.sessionId
    
    client.on 'message', -> 
      console.log 'message'
      
    client.on 'disconnect', ->
      console.log 'disconnect'