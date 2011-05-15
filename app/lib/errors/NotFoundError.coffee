module.exports = (dependencies) -> class NotFoundError extends Error
  constructor: (msg) ->
    this.name = 'NotFoundError';
    super msg
    Error.captureStackTrace(this, arguments.callee);