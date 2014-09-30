AbstractService = require './AbstractService'

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
  
  shouldHavePassword = (password) -> promise (success, error) ->
    if (not password?) or (String(password).length is 0)
      return error new PreconditionError "no password given"
    success()
  
  shouldHaveTracker = (board, post) -> promise (success, error) ->
    Tracker.findOne({board, post}).run (err, tracker) ->
      return error err if err
      return error new PreconditionError "no such post" if not tracker
      success tracker
  
  shouldHaveCorrespondingPost = (board, thread, id) -> promise (success, error) ->
    Thread.findOne(markedForDeletion: false, board: board, id: thread).run (err, thread) ->
      return error err if err
      post = _(thread.posts).find (post) -> Number(post.id) is id
      return error new PreconditionError "no such post" if not post
      success {thread, post}
  
  shouldMatchPassword = (post, password) -> promise (success, error) ->
    if not (String(post.password) is hashes.sha1 password)
      return error new ValidationError "unable to delete post; password does not match"
    success()
  
  removeThread = (thread) -> janitor.sweepThread thread
  removePost = (thread, post, tracker) ->
    all([
      images.deleteByPost thread.board, post
      tracker.remove handle()
      post.remove handle()
    ]).then -> promise (success, error) ->
      thread.lastPost = null if Number(thread.lastPost?.id) is Number(post.id)
      thread.save (err) ->
        return error err if err
        success post
  
  class PostService extends AbstractService
    remove: (board, id, password) -> promise (success, error) ->
      shouldHavePassword(password).then ->
        shouldHaveTracker(board, id).then (tracker) ->
          shouldHaveCorrespondingPost(board, tracker.thread, id).then ({thread, post}) ->
            shouldMatchPassword(post, password).then ->          
              if Number(thread.id) is Number(post.id)
                removeThread(thread).then -> 
                  success post
              else
                removePost(thread, post, tracker).then ->
                  success post
            