module.exports = (dependencies) ->
  {app, mongoose, config} = dependencies
  
  hasBoard = (board) ->
    for group, boards of config.boards
      return true if boards[board]?
    return false
  
  # Front page
  app.get '/', (req, res) ->
    res.render 'index',
      title: 'Aaltoboard'
  
  # Board index
  app.get '/:board/', (req, res, next) ->
    return next() if not hasBoard req.params.board
    res.render 'board',
      board: req.params.board
  
  