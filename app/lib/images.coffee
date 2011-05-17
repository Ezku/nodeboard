fs = require 'fs'

module.exports = (dependencies) ->
  {config} = dependencies
  {promise, all} = dependencies.lib 'promises'
  
  uploadPath = (board, filename) -> config.paths.mount + "/#{board}/" + filename
  
  deleteByPost = (board, post) ->
    unlink = (filename) -> promise (success, error) ->
      path = uploadPath board, filename
      fs.stat path, (err, stat) ->
        return error err if err
        return success() if not stat.isFile()
        fs.unlink path, (err) ->
          return error err if err
          success()
    
    all [
      unlink post.image.thumbnail if post.image?.thumbnail
      unlink post.image.fullsize if post.image?.fullsize
    ]
  
  { deleteByPost }