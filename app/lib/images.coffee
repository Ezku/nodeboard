module.exports = (dependencies) ->
  {config} = dependencies
  
  uploadPath = (board, filename) -> config.paths.mount + "/#{board}/" + filename
  
  deleteByPost = (board, post) ->
    if post.image?.thumbnail
      fs.unlinkSync uploadPath board, post.image.thumbnail
    if post.image?.fullsize
      fs.unlinkSync uploadPath board, post.image.fullsize
  
  { deleteByPost }