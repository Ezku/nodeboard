path = require 'path'
aws = require 'aws-sdk'
Promise = require 'bluebird'
fs = Promise.promisifyAll require 'fs'

aws.config.update {
  accessKeyId: process.env.AWS_ACCESS_KEY
  secretAccessKey: process.env.AWS_SECRET_KEY
}

awsClient = ->
  Promise.promisifyAll (new aws.S3)

sendToBucket = (key, type) -> (data) ->
  awsClient().putObjectAsync {
    Bucket: process.env.S3_BUCKET
    Key: key
    ContentType: type
    Body: data
    ACL: 'public-read'
  }

deleteFromBucket = (key) ->
  awsClient().deleteObjectAsync {
    Bucket: process.env.S3_BUCKET
    Key: key
  }

awsFileAddress = (key) ->
  bucket = process.env.S3_BUCKET
  hostname = process.env.S3_HOSTNAME
  "http://#{bucket}.#{hostname}/#{key}"

module.exports =
  upload: (type, filename, key = null) ->
    key ?= path.basename filename
    fs.readFileAsync(filename).then(sendToBucket(key, type)).then ->
      awsFileAddress key

  delete: deleteFromBucket
