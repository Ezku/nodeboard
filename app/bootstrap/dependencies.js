(function() {
  module.exports = function(root) {
    var dependencies;
    dependencies = {
      express: require('express'),
      mongoose: require('mongoose'),
      coffeekup: require(root + '/vendor/coffeekup.js'),
      backbone: require('backbone'),
      browserify: require('browserify'),
      jsmin: require('jsmin'),
      formidable: require('formidable'),
      imagemagick: require('imagemagick'),
      io: require('socket.io'),
      hash: require('hashlib'),
      q: require('q'),
      '_': require('underscore')
    };
    dependencies.lib = (function() {
      var libs;
      libs = {};
      return function(name) {
        if (!(libs[name] != null)) {
          libs[name] = require(root + '/app/lib/' + name + '.js')(dependencies);
        }
        return libs[name];
      };
    })();
    return dependencies;
  };
}).call(this);
