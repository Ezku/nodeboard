module.exports = (dependencies) ->
  {services} = dependencies
  {promise, filter} = dependencies.lib 'promises'
  ValidationError = dependencies.lib 'errors/ValidationError'
  
  shouldHaveImage = filter (req, res) -> promise (success, error) ->
    if not req.files?.image
      error new ValidationError "A new thread should have an image"
    else
      success()
  
  shouldHaveImageOrContent = filter (req, res) -> promise (success, error) ->
    if not req.files?.image and not req.body?.content?.length
      error new ValidationError "A reply should have either an image or some content"
    else
      success()
  
  { shouldHaveImage, shouldHaveImageOrContent }