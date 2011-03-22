module.exports = (root) ->
  config = 
    paths:
      root: root
      app: root + '/app/'
      models: root + '/app/models'
      views: root + '/app/views'
      public: root + '/public/'
      vendor: root + '/vendor/'
    mongo:
      connection: process.env.DUOSTACK_DB_MONGODB or 'mongodb://localhost/aaltoboard'
  
  config