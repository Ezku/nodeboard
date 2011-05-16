module.exports = (dependencies) ->
  {config} = dependencies
  {promise, succeed} = dependencies.lib 'promises'
  hashes = dependencies.lib 'hashes'
  ValidationError = dependencies.lib 'errors/ValidationError'
  Tracker = dependencies.mongoose.model 'Tracker'
  
  ip = (req) -> req.connection.remoteAddress
  salt = (req) -> req.params?.board?
  image = (req) -> req.files?.image?.path
  
  hash = (data, salt) ->
    hashes.sha1 (salt + data)
  ipHash = (req) ->
    hash (ip req), (salt req)
  imageHash = (req) ->
    hashes.md5_file(image req).then (result) ->
      succeed hash(result, (salt req))
  
  past = (seconds) -> $gt: new Date (Date.now() - seconds*1000)
  
  countRecentUploads = (board, ipHash) -> promise (success, error) ->
    Tracker
    .count(board: board, ipHash: ipHash, date: past config.tracking.floodWindow)
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
  
  # In case of multiple uploads within a certain period of time, slow down the
  # possible upload rate by applying a timeout. If a certain rate is nevertheless
  # exceeded, reports an error due to flooding.
  preventFlood = (req, res) -> 
    req.hash = {} if not req.hash
    req.hash.ip = ipHash(req)
    countRecentUploads(req.params.board, req.hash.ip).then (count) ->
      promise (success, error) ->
        if count < config.tracking.minCurtailRate
          # Below curtail rate - do not restrict
          success()
        else if count < config.tracking.maxPostRate
          # Above curtail rate - restrict posting speed
          setTimeout success, count * 1000
        else
          # Exceeded cap, report flood
          error new ValidationError "flood detected; please wait before posting"
  
  # Report an error if an image with the same hash has already been posted.
  enforceUniqueImage = (req, res) -> promise (success, error) ->
    return success() if not req.files?.image or not config.tracking.checkDuplicateImages
    req.hash = {} if not req.hash
    imageHash(req).then (hash) ->
      req.hash.image = hash
      findMatchingImage(req.params.board, hash).then (tracker) -> promise (success, error) ->
        return success() if not tracker
        error new ValidationError "duplicate image detected"
  
  # Creates a tracker entry based on the current upload
  trackUpload = (req, res) -> promise (success, error) ->
    post = res.thread.lastPost or res.thread.firstPost
    tracker = new Tracker
      board: req.params.board
      thread: res.thread.id
      post: post.id
      date: post.date
      ipHash: req.hash.ip
      imageHash: req.hash.image
    tracker.save (err) ->
      return error err if err
      success tracker
  
  { preventFlood, enforceUniqueImage, trackUpload }