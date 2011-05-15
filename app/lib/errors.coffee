module.exports = (dependencies) ->
  NotFoundError = dependencies.lib 'errors/NotFoundError'
  ValidationError = dependencies.lib 'errors/ValidationError'
  PreconditionError = dependencies.lib 'errors/PreconditionError'
  
  shouldRespondWithJson = (req) -> ((req.originalUrl.indexOf '/api/') is 0)
  
  (fallback) -> (err, req, res, next) ->
    template = switch true
      when err instanceof NotFoundError then 'errors/404'
      when err instanceof PreconditionError then 'errors/404'
      when err instanceof ValidationError then 'errors/invalid'
    
    if not fallback
      template = 'errors/500'
    
    if shouldRespondWithJson req
      res.send {
        error: err.message
      }
    else if template
      res.render template,
        error: err
    else
      fallback(err, req, res, next)