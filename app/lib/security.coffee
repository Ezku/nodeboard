module.exports = (dependencies) ->
  {config, hashlib} = dependencies
  {promise} = dependencies.lib 'promises'
  Tracker = dependencies.mongoose.model 'Tracker'
  
  hash = (data, salt) ->
    hashlib.sha1 (salt + data)
  ipHash = (req) ->
    hash req.connection.remoteAddress, req.params?.board?
  imageHash = (req) -> promise (success, error) ->
    hashlib.md5_file req.files.image.path, (result) ->
      if result
        success hash result, req.params?.board?
      else
        error()
  
  countRecentUploads = (ipHash) -> promise (success, error) ->
    Tracker
    .count(ipHash: ipHash, date: {$gt: (Date.now() - config.security.floodwindow)})
    .run (err, count) ->
      return error err if err
      success count
  
  findMatchingImage = (imageHash) -> promise (success, error) ->
    Tracker
    .find({imageHash})
    .limit(1)
    .run (err, trackers) ->
      return error err if err
      success trackers[0]
  
  preventFlood = (req, res) -> promise (success, error) ->
    req.hash = {} if not req.hash
    req.hash.ip = ipHash(req)
    success()
    # TODO: Implement
    
  enforceUniqueImage = (req, res) -> promise (success, error) ->
    return success() if not req.files?.image
    req.hash = {} if not req.hash
    imageHash(req).then (hash) ->
      req.hash.image = hash
      # TODO: Implement
    
  trackUpload = (req, res) -> promise (success, error) ->
    tracker = new Tracker
      board: req.params.board
      thread: res.thread.id
      post: res.thread.lastPost.id
      date: res.thread.lastPost.date
      ipHash: req.hash.ip
      imageHash: req.hash.image
    tracker.save (err) ->
      return error err if err
      success tracker
  
  { preventFlood, enforceUniqueImage, trackUpload }