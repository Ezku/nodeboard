crypto = require 'crypto'
fs = require 'fs'

module.exports = (dependencies) ->
  {promise} = dependencies.lib 'promises'
  
  hash = (algorithm) -> (string) ->
    crypto.createHash(algorithm).update(string).digest()
  
  sha1 = hash 'sha1'
  md5 = hash 'md5'
  
  md5_file = (filename) -> promise (success, error) ->
    fs.readFile filename, (err, data) ->
      return error err if err
      success md5 data
  
  { sha1, md5_file }