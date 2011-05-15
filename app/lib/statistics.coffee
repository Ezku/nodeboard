module.exports = (dependencies) ->
  {mongoose} = dependencies
  {promise, all} = dependencies.lib 'promises'
  Thread = mongoose.model 'Thread'
  Tracker = mongoose.model 'Tracker'
  
  stats =
    "Users online": -> promise (success, error) ->
      success 4
  
  ->
    results = {}
    promises = for statistic, calculate of stats
      do (statistic) ->
        calculate().then (result) ->
          results[statistic] = result
          promise (success) -> success()
    
    all(promises...).then ->
      promise (success) -> success results