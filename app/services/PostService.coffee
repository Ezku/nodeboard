AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->
  {mongoose} = dependencies
  {promise, succeed} = dependencies.lib 'promises'
  hashes = dependencies.lib 'hashes'
  images = dependencies.lib 'images'
  janitor = dependencies.lib 'janitor'
  ValidationError = dependencies.lib 'errors/ValidationError'
  PreconditionError = dependencies.lib 'errors/PreconditionError'
  Thread = mongoose.model 'Thread'
  Tracker = mongoose.model 'Tracker'
  
  class PostService extends AbstractService
    remove: (board, id, password) -> promise (success, error) ->
      return error new PreconditionError "no password given" if (String(password ? '').length is 0)
      
      Tracker.findOne(board: board, post: id).run (err, tracker) ->
        return error err if err
        return error new PreconditionError "no such post" if not tracker
        Thread.findOne(markedForDeletion: false, id: tracker.thread).run (err, thread) ->
          return error err if err
          post = (post for post in thread.posts when post.id = id)[0]
          return error new PreconditionError "no such post" if not post
          
          if (not post.password is hashes.sha1 password)
            return error new ValidationError "unable to delete post; password does not match"
          
          if thread.id is post.id
            janitor.sweepThread(thread).then succeed post
          else
            images.deleteByPost thread.board, post
            tracker.remove()
            post.remove()
            if thread.lastPost?.id is post.id
              thread.lastPost.remove()
            thread.save()
            succeed post