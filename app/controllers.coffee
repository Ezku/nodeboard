module.exports = (dependencies) ->
  {app, mongoose} = dependencies
  
  app.get '/', (req, res) ->
    res.render 'index',
      title: 'Aaltoboard'