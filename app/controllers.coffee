module.exports = (dependencies) ->
  {app, config, services, formidable, io, channels} = dependencies

  # Intercepts middleware handler chain with a function, passing control down the chain immediately afterwards.
  tap = (f) -> (req, res, next) ->
    f(req, res)
    next()

  # Converts a promise function to a valid express.js middleware filter
  {filter} = dependencies.lib 'promises'
  
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
  validateThread = filter (req) -> service('Thread').read req.params
  
  # Declare a set of parameters that can be accepted in the request body 
  accept = (params...) -> (req, res, next) ->
    input = req.body
    accepted = {}
    accepted[name] = input[name] for name in params
    req.body = accepted
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
  
  # Builds a data accumulator function with three behaviours
  # f(): returns accumulated data as an object
  # f(key): returns the value associated with the key if any
  # f(key, value): associates key with value
  # The constructed accumulator is assigned to the request using the given name.
  collector = (name) -> (req, res, next) ->
    data = {}
    res[name] = (key, value) ->
      return data if not key?
      return data[key] if not value?
      data[key] = value
    next()
  
  # Declares the overview and detail data collectors
  panels = [collector('overview'), collector('detail')]
  
  # Accepts a data collector, creating a filter that assigns board data to it on request
  collectBoard = (collector) -> [
    validateBoard,
    filter (req, res) ->
      service('Board').read(req.params).then (threads) ->
        res[collector] 'view', 'board'
        res[collector] 'threads', threads
  ]
  
  # Accepts a data collector, creating a filter that assigns thread data to it on request
  collectThread = (collector) -> [
    validateThread,
    filter (req, res) ->
      service('Thread').read(req.params).then (thread) ->
        res[collector] 'view', 'thread'
        res[collector] 'thread', thread
  ]
  
  # Renders the panels view with data from the overview and detail data accumulators
  renderPanels = (req, res, next) ->
    res.render 'panels',
      overview: res.overview()
      detail: res.detail()
  
  # Accepts a set of parameters, creating a filter that will assign those to either the provided collector or the request
  static = (collector, params) -> tap (req, res) ->
    if typeof params is 'object'
      res[collector] name, value for name, value of params
    else
      res.locals collector
  
  # Retrieves a tracking filter from the library
  tracking = (name) -> filter (req, res) -> dependencies.lib('tracking')[name] req, res
  
  # Retrieves a janitor filter from the library
  janitor = (name) -> dependencies.lib('janitor')[name]
  
  # Front page
  app.get '/',
    panels,
    static(
      title: 'Aaltoboard'
      id: "front-page"
      class: ""
    ),
    static('overview',
      view: 'index'
      title: 'Aaltoboard'
    ),
    renderPanels
  
  app.get '/api/',
    (req, res) ->
      result = {}
      for group, boards of config.boards
        for id, data of boards
          result[id] =
            name: data.name
            url: "/api/#{id}/"
            group: group
      res.send result
  
  # Board index
  app.get '/api/:board/',
    collectBoard('local'),
    (req, res) ->
      res.send {
        board: req.params.board
        threads: res.local 'threads'
      }
  
  app.get '/:board/',
    panels,
    collectBoard('overview'),
    tap (req, res) ->
      board = req.params.board
      name = getBoardName board
      boardTitle = "/#{board}/ - #{name}"
      
      res.overview 'board', board
      res.overview 'title', boardTitle
      
      res.locals
        board: board
        title: boardTitle
        class: "board-page"
        id: "board-page-#{board}"
      
    renderPanels
  
  # Receiving post data and passing it through the thread service
  receivePost = (action) -> [
    accept('content', 'password'),
    tracking('preventFlood'),
    tracking('enforceUniqueImage'),
    filter (req, res) ->
      service('Thread')[action]({ thread: req.params, post: req.body, image: req.files?.image })
      .then (thread) ->
        res.thread = thread
    tracking('trackUpload')
  ]
  
  # Creating a new thread
  receiveThread = [
    validateBoard,
    handleImageUpload,
    receivePost('create'),
    tap (req, res) ->
      thread = res.thread
      channel.broadcastToChannel 'newthread', thread.board, {thread: thread.id}
    tap janitor('upkeep')
  ]
  
  app.post '/api/:board/',
    receiveThread,
    (req, res) ->
      thread = res.thread
      res.send {
        board: req.params.board
        id: thread.id
        thread: thread
      }
  
  app.post '/:board/',
    receiveThread,
    (req, res) ->
      thread = res.thread
      res.redirect "/#{req.params.board}/#{thread.toJSON().id}/"
  
  # Thread view
  app.get '/api/:board/:id',
    collectThread('local'),
    (req, res) ->
      res.send {
        board: req.params.board
        id: req.params.id
        thread: res.local 'thread'
      }
  
  app.get '/:board/:id/',
    panels,
    collectBoard('overview'),
    collectThread('detail'),
    tap (req, res) ->
      board = req.params.board
      name = getBoardName req.params.board
      boardTitle = "/#{board}/ - #{name}"
      threadTitle = "/#{board}/#{req.params.id}"
      
      res.overview 'board', board
      res.overview 'title', boardTitle
      res.detail 'title', threadTitle
      
      res.locals
        title: threadTitle
        board: board
        class: "thread-page"
        id: "thread-page-#{req.params.id}"
    
    renderPanels
  
  # Replying to a thread
  receiveReply = [
    validateBoard,
    handleImageUpload,
    validateThread,
    receivePost('update'),
    tap (req, res) ->
      thread = res.thread
      channel.broadcastToChannel 'reply', thread.board, {thread: thread.id}
  ]
  
  app.post '/api/:board/:id/',
    receiveReply,
    (req, res) ->
      res.send {
        board: req.params.board
        id: req.params.id
        thread: res.thread
      }
  
  app.post '/:board/:id/',
    receiveReply,
    (req, res) ->
      res.redirect "/#{req.params.board}/#{req.params.id}/"

  # Socket.io channels  
  socket = io.listen app
  channel = channels.listen socket, {}