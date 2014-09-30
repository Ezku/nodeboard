Promise = require 'bluebird'
crypto = require 'crypto'
fs = Promise.promisifyAll require 'fs'

module.exports = (dependencies) ->
  {promise} = dependencies.lib 'promises'
  
  hash = (algorithm) -> (string) ->
    crypto.createHash(algorithm).update(string).digest('hex')
  
  sha1 = hash 'sha1'
  md5 = hash 'md5'
  
  md5_file = (filename) ->
    fs.readFileAsync(filename).then(md5)
  
  { sha1, md5_file }