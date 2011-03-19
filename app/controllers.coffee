module.exports = (dependencies) ->
  {app} = dependencies
  
  app.get '/', (req, res) ->
    res.render 'index',
      title: 'Aaltoboard'