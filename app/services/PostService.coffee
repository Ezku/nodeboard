AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->
  {mongoose, hashlib} = dependencies
  {promise, succeed} = dependencies.lib 'promises'
  images = dependencies.lib 'images'
  janitor = dependencies.lib 'janitor'
  ValidationError = dependencies.lib 'errors/ValidationError'
  Thread = mongoose.model 'Thread'
  Tracker = mongoose.model 'Tracker'
  
  class PostService extends AbstractService
    remove: (board, id, password) -> promise (success, error) ->
      Tracker.find(board: board, post: id).run (err, tracker) ->
        return error err if err
        Thread.find(markedForDeletion: false, id: tracker.thread).run (err, thread) ->
          return error err if err
          post = (post in thread.posts when post.id = id)
          if not post.password is hashlib.sha1 password
            return error new ValidationError "unable to delete post; password does not match"
          if thread.id is post.id
            janitor.sweepThread(thread).then succeed post
          else
            images.deleteByPost thread.board, post
            tracker.remove()
            post.remove()
            if thread.lastPost.id is postid
              thread.lastPost.remove()
            thread.save()
            succeed post