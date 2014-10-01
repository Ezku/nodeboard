Promise = require 'bluebird'
AbstractService = require './AbstractService'

module.exports = (dependencies) ->
  {_,mongoose} = dependencies
  hashes = dependencies.lib 'hashes'
  images = dependencies.lib 'images'
  janitor = dependencies.lib 'janitor'
  ValidationError = dependencies.lib 'errors/ValidationError'
  PreconditionError = dependencies.lib 'errors/PreconditionError'
  Thread = mongoose.model 'Thread'
  Tracker = mongoose.model 'Tracker'
  
  shouldHavePassword = (password) -> new Promise (success, error) ->
    if (not password?) or (String(password).length is 0)
      return error new PreconditionError "no password given"
    success()
  
  shouldHaveTracker = (board, post) -> new Promise (success, error) ->
    Tracker.findOne({board, post}).run (err, tracker) ->
      return error err if err
      return error new PreconditionError "no such post" if not tracker
      success tracker
  
  shouldHaveCorrespondingPost = (board, thread, id) -> new Promise (success, error) ->
    Thread.findOne(markedForDeletion: false, board: board, id: thread).run (err, thread) ->
      return error err if err
      post = _(thread.posts).find (post) -> Number(post.id) is id
      return error new PreconditionError "no such post" if not post
      success {thread, post}
  
  shouldMatchPassword = (post, password) -> new Promise (success, error) ->
    if not (String(post.password) is hashes.sha1 password)
      return error new ValidationError "unable to delete post; password does not match"
    success()
  
  removeThread = (thread) -> janitor.sweepThread thread
  removePost = (thread, post, tracker) ->
    Promise.join(
      images.deleteByPost thread.board, post
      Promise.promisifyAll(tracker).removeAsync()
      Promise.promisifyAll(post).removeAsync()
    ).then -> new Promise (success, error) ->
      thread.lastPost = null if Number(thread.lastPost?.id) is Number(post.id)
      thread.save (err) ->
        return error err if err
        success post
  
  class PostService extends AbstractService
    remove: (board, id, password) ->
      shouldHavePassword(password).then ->
        shouldHaveTracker(board, id).then (tracker) ->
          shouldHaveCorrespondingPost(board, tracker.thread, id).then ({thread, post}) ->
            shouldMatchPassword(post, password).then ->
              (if Number(thread.id) is Number(post.id)
                removeThread(thread)
              else
                removePost(thread, post, tracker)
              ).then ->
                  post
            