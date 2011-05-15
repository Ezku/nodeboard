(function() {
  module.exports = function(dependencies) {
    var NotFoundError, PreconditionError, ValidationError, shouldRespondWithJson;
    NotFoundError = dependencies.lib('errors/NotFoundError');
    ValidationError = dependencies.lib('errors/ValidationError');
    PreconditionError = dependencies.lib('errors/PreconditionError');
    shouldRespondWithJson = function(req) {
      return (req.originalUrl.indexOf('/api/')) === 0;
    };
    return function(fallback) {
      return function(err, req, res, next) {
        var template;
        template = (function() {
          switch (true) {
            case err instanceof NotFoundError:
              return 'errors/404';
            case err instanceof PreconditionError:
              return 'errors/404';
            case err instanceof ValidationError:
              return 'errors/invalid';
          }
        })();
        if (!fallback) {
          template = 'errors/500';
        }
        if (shouldRespondWithJson(req)) {
          return res.send({
            error: err.message
          });
        } else if (template) {
          return res.render(template, {
            error: err
          });
        } else {
          return fallback(err, req, res, next);
        }
      };
    };
  };
}).call(this);
