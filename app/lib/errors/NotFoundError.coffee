module.exports = (dependencies) -> class NotFoundError extends Error
  constructor: (msg) ->
    this.name = 'NotFoundError'
    this.message = msg
    Error.captureStackTrace(this, arguments.callee)