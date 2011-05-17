module.exports = (dependencies) ->
  {app, config, services, formidable, io, channels} = dependencies
  {filter} = dependencies.lib 'promises'
  boards = dependencies.lib 'boards'

  # Retrieves a service object instance
  service = services.get
  
  # Retrieves a precondition filter
  precondition = (condition) -> (dependencies.lib 'preconditions')[condition]
  
  # Retrieves a validation filter
  validate = (validator) -> (dependencies.lib 'validation')[validator]
  
  # Retrieves a tracking filter from the library
  tracking = (name) -> filter (req, res) -> dependencies.lib('tracking')[name] req, res
  
  # Retrieves a janitor filter from the library
  janitor = (name) -> dependencies.lib('janitor')[name]

  # Intercepts middleware handler chain with a function, passing control down the chain immediately afterwards.
  tap = (f) -> (req, res, next) ->
    try
      f(req, res)
      next()
    catch e
      next(e)
  
  # Declare a set of parameters that can be accepted in the request body 
  accept = (params...) -> tap (req, res) ->
    input = req.body ? {}
    accepted = {}
    accepted[name] = input[name] for name in params when input[name]?
    req.body = accepted
  
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
  collector = (name) -> tap (req, res) ->
    data = {}
    res[name] = (key, value) ->
      return data if not key?
      return data[key] if not value?
      data[key] = value
  
  # Declares the overview and detail data collectors
  panels = [collector('overview'), collector('detail')]
  
  # Collects an overview of recent threads into a collector in the response
  collectOverview = (collector) -> [
    filter (req, res) ->
      service('Board').index().then (threads) ->
        res[collector] 'view', 'overview'
        res[collector] 'threads', threads
  ]
  
  # Collects a board into a collector in the response
  collectBoard = (collector) -> [
    precondition('shouldHaveBoard'),
    filter (req, res) ->
      query = {
        board: req.params.board
        limit: req.query.limit
        pages: req.query.pages
      }
      service('Board').read(query).then (threads) ->
        res[collector] 'view', 'board'
        res[collector] 'threads', threads
  ]
  
  # Collects a thread into a collector in the response
  collectThread = (collector) -> [
    precondition('shouldHaveThread'),
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
  
  # Front page
  app.get '/',
    panels,
    tap (req, res) ->
      res.locals
        title: 'Aaltoboard'
        id: "front-page"
        class: ""
      
      res.overview 'view', 'index'
    collectOverview('detail'),
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
  
  # Post deletion
  app.post '/api/:board/:id/delete/',
    precondition('shouldHaveBoard'),
    accept('password'),
    filter (req, res) ->
      service('Post').remove(String(req.params.board), Number(req.params.id), req.body?.password)
    (req, res) ->
      res.send success: true
        
  
  # Board index
  app.get '/api/:board/',
    collectBoard('local'),
    (req, res) ->
      threads = res.local 'threads'
      res.send {
        board: req.params.board
        total: threads.total
        threads: threads
      }
  
  app.get '/:board/',
    panels,
    collectBoard('overview'),
    collectOverview('detail'),
    tap (req, res) ->
      board = req.params.board
      name = boards.getName board
      boardTitle = "/#{board}/ - #{name}"
      
      res.overview 'board', board
      res.overview 'title', boardTitle
      threads = res.overview 'threads'
      
      res.locals
        board: board
        total: threads.total
        pages: if req.query.pages then req.query.pages else 1
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
    precondition('shouldHaveBoard'),
    handleImageUpload,
    validate('shouldHaveImage'),
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
      name = boards.getName req.params.board
      boardTitle = "/#{board}/ - #{name}"
      threadTitle = "/#{board}/#{req.params.id}/"
      
      res.overview 'board', board
      res.overview 'title', boardTitle
      res.detail 'title', threadTitle
      threads = res.overview 'threads'
      
      res.locals
        title: threadTitle
        board: board
        total: threads.total
        pages: if req.query.pages then req.query.pages else 1
        class: "thread-page"
        id: "thread-page-#{req.params.id}"
    
    renderPanels
  
  # Replying to a thread
  receiveReply = [
    precondition('shouldHaveBoard'),
    handleImageUpload,
    precondition('shouldHaveThread'),
    validate('shouldHaveImageOrContent'),
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