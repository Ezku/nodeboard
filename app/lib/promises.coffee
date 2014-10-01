Promise = require 'bluebird'
q = require 'q'

module.exports = (dependencies) ->
  # Promise to fulfil a function.
  # The function is called with (resolve, reject) and a promise returned.
  # If the function returns its own promise, use that directly instead.
  promise = (f) -> Promise.resolve do ->
    deferred = q.defer()
    result = f deferred.resolve, deferred.reject
    if q.isPromise result
      result
    else
      deferred.promise
  
  # Converts a promise function to a valid express.js middleware filter
  filter = (f) -> (req, res, next) ->
    Promise.resolve(f req, res).then(
      -> next()
      (err) -> next err
    )

  all = Promise.all
  succeed = Promise.resolve
  fail = Promise.reject
  
  { promise, all, filter, succeed, fail }