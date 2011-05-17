AbstractService = require './AbstractService.js'

module.exports = (dependencies) ->
  {_,mongoose} = dependencies
  {promise, succeed, all} = dependencies.lib 'promises'
  hashes = dependencies.lib 'hashes'
  images = dependencies.lib 'images'
  janitor = dependencies.lib 'janitor'
  ValidationError = dependencies.lib 'errors/ValidationError'
  PreconditionError = dependencies.lib 'errors/PreconditionError'
  Thread = mongoose.model 'Thread'
  Tracker = mongoose.model 'Tracker'
  
  handle = (result) -> (err) -> promise (success, error) ->
    return error err if err
    success result
  
  class PostService extends AbstractService
    remove: (board, id, password) -> promise (success, error) ->
      if (not password?) or (String(password).length is 0)
        return error new PreconditionError "no password given"
      
      Tracker.findOne(board: board, post: id).run (err, tracker) ->
        return error err if err
        return error new PreconditionError "no such post" if not tracker
        Thread.findOne(markedForDeletion: false, id: tracker.thread).run (err, thread) ->
          return error err if err
          post = _(thread.posts).find (post) -> Number(post.id) is id
          return error new PreconditionError "no such post" if not post
          
          if not (String(post.password) is hashes.sha1 password)
            return error new ValidationError "unable to delete post; password does not match"
          
          if Number(thread.id) is Number(post.id)
            janitor.sweepThread(thread).then ->
              success post
          else
            all([
              images.deleteByPost thread.board, post
              tracker.remove handle()
              post.remove handle()
              (thread.lastPost.remove handle()) if thread.lastPost?.id is post.id
            ]).then(
              ->
                thread.save (err) ->
                  return error err if err
                  success post
              error
            )
            