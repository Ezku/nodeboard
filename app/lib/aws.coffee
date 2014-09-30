aws = require 'aws'
Promise = require 'bluebird'
fs = Promise.promisifyAll require 'fs'

aws.config.update {
  accessKeyId: process.env.AWS_ACCESS_KEY
  secretAccessKey: process.env.AWS_SECRET_KEY
}

awsClient = ->
  Promise.promisifyAll (new AWS.S3).client

sendToBucketAs = (key) -> (data) ->
  awsClient().putObjectAsync {
    Bucket: process.env.S3_BUCKET
    Key: key
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
  upload: (filename, key) ->
    fs.readFileAsync(filename).then(sendToBucketAs(key)).then ->
      awsFileAddress key

  delete: deleteFromBucket
