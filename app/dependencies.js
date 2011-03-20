(function() {
  module.exports = function(root) {
    var dependencies, vendor;
    vendor = function(path) {
      return root + '/vendor/' + path;
    };
    dependencies = {
      paths: {
        root: root,
        app: root + '/app/',
        models: root + '/app/models',
        views: root + '/app/views',
        public: root + '/public/',
        vendor: root + '/vendor/'
      },
      express: require('express'),
      coffeekup: require(vendor('coffeekup.js'))
    };
    return dependencies;
  };
}).call(this);
