module.exports =

  class AbstractService
    
    @connect: (Model) ->
      service = new this
      Model::sync = (method, model, success, error) ->
        if service[method]
          service[method] model, success, error
        else
          error "unsupported method '#{method}' on #{model.url()}"
      this