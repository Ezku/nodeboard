module.exports = (dependencies) -> class ValidationError extends Error
  constructor: (msg) ->
    this.name = 'ValidationError';
    super msg
    Error.captureStackTrace(this, arguments.callee);