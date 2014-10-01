module.exports = (root) ->
  config = 
    paths:
      root: root
      app: root + '/app/'
      schemas: root + '/app/schemas/'
      services: root + '/app/services/'
      views: root + '/app/views/'
      shared: root + '/app/shared/'
      public: root + '/public/'
      vendor: root + '/vendor/'
      mount: root + '/mnt/'
      temp: root + '/tmp/'
    
    mongo:
      connection: process.env.MONGOLAB_URI
    
    images:
      thumbnail:
        width: 128
        height: 128
    
    tracking:
      checkDuplicateImages: true
      floodWindow: 60
      minCurtailRate: 2
      maxPostRate: 10
      imageHashTimeout: 10
    
    content:
      threadsPerPage: 10
      maximumReplyCount: 100
      maximumThreadAmount: 100
      orphanedTrackerCheckProbability: 10
    
    sitename: process.env.NODEBOARD_SITE_NAME
    boards: JSON.parse process.env.NODEBOARD_BOARDS
        
  config
