Promise = require 'bluebird'
aws = require './aws'

module.exports = (dependencies) ->
  
  deleteByPost = (board, post) ->
    Promise.all [
      aws.delete post.image.thumbnail if post.image?.thumbnail
      aws.delete post.image.fullsize if post.image?.fullsize
    ]
  
  { deleteByPost }