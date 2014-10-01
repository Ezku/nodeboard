Promise = require 'bluebird'
fs = Promise.promisifyAll require 'fs'

module.exports = (dependencies) ->
  {config} = dependencies
  
  uploadPath = (board, filename) -> config.paths.mount + "/#{board}/" + filename
  
  deleteByPost = (board, post) ->
    unlink = (filename) ->
      path = uploadPath board, filename
      fs.statAsync(path).then (stat) ->
        if stat.isFile()
          fs.unlinkAsync(path)
    
    Promise.all [
      unlink post.image.thumbnail if post.image?.thumbnail
      unlink post.image.fullsize if post.image?.fullsize
    ]
  
  { deleteByPost }