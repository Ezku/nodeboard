(function() {
  module.exports = function(dependencies) {
    return function(err, req, res, next) {
      var template;
      template = (function() {
        switch (true) {
          case err instanceof NotFoundError:
            return 'errors/404';
        }
      })();
      if (template) {
        return res.render(template, {
          error: err
        });
      } else {
        return next();
      }
    };
  };
}).call(this);
