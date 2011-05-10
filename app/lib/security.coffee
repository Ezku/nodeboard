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
  
  countRecentUploads = (board, ipHash) -> promise (success, error) ->
    recent = Date.now() - config.security.floodWindow
    Tracker
    .count(board: board, ipHash: ipHash, date: {$gt: recent}) #TODO: make this work
    .run (err, count) ->
      return error err if err
      success count
  
  findMatchingImage = (board, imageHash) -> promise (success, error) ->
    Tracker
    .find({board, imageHash})
    .limit(1)
    .run (err, trackers) ->
      return error err if err
      success trackers[0]
  
  preventFlood = (req, res) -> 
    req.hash = {} if not req.hash
    req.hash.ip = ipHash(req)
    countRecentUploads(req.params.board, req.hash.ip).then (count) ->
      promise (success, error) ->
        if count < config.security.minCurtailRate
          # Below curtail rate - do not restrict
          success()
        else if count < config.security.maxPostRate
          # Above curtail rate - restrict posting speed
          setTimeout success, count
        else
          # Exceeded cap, report flood
          error new Error "flood detected; please wait before posting"
    
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