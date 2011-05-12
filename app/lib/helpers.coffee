module.exports = (dependencies) ->
  static = 
    config: dependencies.config
    
  dynamic = {}
  
  { static, dynamic }