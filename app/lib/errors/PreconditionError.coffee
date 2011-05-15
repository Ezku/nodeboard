module.exports = (dependencies) -> class PreconditionError extends Error
  constructor: (msg) ->
    this.name = 'PreconditionError';
    super msg
    Error.captureStackTrace(this, arguments.callee);