module.exports = (dependencies) ->
  {q} = dependencies
  
  # Promise to fulfil a function.
  # The function is called with (resolve, reject) and a promise returned.
  promise = (f) ->
  	deferred = q.defer()
  	result = f deferred.resolve, deferred.reject
  	deferred.promise
  
  # Converts a promise function to a valid express.js middleware filter
  filter = (f) -> (req, res, next) ->
    result = f req, res
    result.then (-> next()), ((err) -> next err)

  ###
  Given a list of promises, creates a promise that will be resolved or rejected
  when all the promises on the list have either been resolved or rejected. In
  case of mixed successes the result will be a rejection.
  ###
  all = (promises) -> promise (resolve, reject) ->
  	resolve() if promises.length is 0
  	resolved = []
  	rejected = []

  	next = ->
  		return unless resolved.length + rejected.length == promises.length
  		if rejected.length is 0
  			resolve resolved
  		else
  			reject rejected

  	for p in promises
  		p.then (value) ->
  				resolved.push value
  				do next
  			, (error) ->
  				rejected.push error
  				do next
  
  { promise, all, filter }