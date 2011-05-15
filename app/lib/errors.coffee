module.exports = (dependencies) ->
  (err, req, res, next) ->
    template = switch true
      when err instanceof NotFoundError then 'errors/404'
    
    if template
      res.render template,
        error: err
    
    else
      next()