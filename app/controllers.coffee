module.exports = (dependencies) ->
  {app, mongoose, config} = dependencies
  
  app.dynamicHelpers
    config: -> config
  
  app.get '/', (req, res) ->
    res.render 'index',
      title: 'Aaltoboard'