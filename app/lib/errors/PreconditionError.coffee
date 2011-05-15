module.exports = (dependencies) -> class PreconditionError extends Error
  constructor: (msg) ->
    this.name = 'PreconditionError'
    this.message = msg
    Error.captureStackTrace(this, arguments.callee)