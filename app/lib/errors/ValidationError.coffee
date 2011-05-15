module.exports = (dependencies) -> class ValidationError extends Error
  constructor: (msg) ->
    this.name = 'ValidationError'
    this.message = msg
    Error.captureStackTrace(this, arguments.callee)