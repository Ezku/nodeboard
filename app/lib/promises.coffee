module.exports = (dependencies) ->
  {q, qutil} = dependencies
  
  # Promise to fulfil a function.
  # The function is called with (resolve, reject) and a promise returned.
  # If the function returns its own promise, use that directly instead.
  promise = (f) ->
  	deferred = q.defer()
  	result = f deferred.resolve, deferred.reject
  	if q.isPromise result
  	  result
  	else
  	  deferred.promise
  
  # Converts a promise function to a valid express.js middleware filter
  filter = (f) -> (req, res, next) ->
    q.when(
      (f req, res),
      (-> next()),
      ((err) -> next err)
    )

  all = qutil.whenAll
  
  succeed = (result) -> promise (success) -> success result
  fail = (reason) -> promise (success, error) -> error reason
  
  { promise, all, filter, succeed, fail }