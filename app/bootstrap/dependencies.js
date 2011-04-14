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
      io: require('socket.io')
    };
    return dependencies;
  };
}).call(this);
