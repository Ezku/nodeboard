(function() {
  module.exports = function(root) {
    var config;
    config = {
      paths: {
        root: root,
        app: root + '/app/',
        models: root + '/app/models',
        views: root + '/app/views',
        public: root + '/public/',
        vendor: root + '/vendor/'
      },
      mongo: {
        connection: process.env.DUOSTACK_DB_MONGODB || 'mongodb://localhost/aaltoboard'
      }
    };
    return config;
  };
}).call(this);
