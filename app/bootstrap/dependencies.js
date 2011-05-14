(function() {
  module.exports = function(root) {
    var dependencies;
    dependencies = {
      express: require('express'),
      mongoose: require('mongoose'),
      coffeekup: require(root + '/vendor/coffeekup.js'),
      channels: require(root + '/vendor/socket.io-channels/index.js'),
      backbone: require('backbone'),
      browserify: require('browserify'),
      jsmin: require('jsmin'),
      formidable: require('formidable'),
      imagemagick: require('imagemagick'),
      io: require('socket.io'),
      hashlib: require('hashlib'),
      q: require('q'),
      '_': require('underscore'),
      mersenne: require('mersenne')
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
