# nodeboard [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

An imageboard you can deploy to Heroku with the push of a button.

Go ahead, press it. You know you want to.


## Development

Requirements:

- mongo
- imagemagick
- heroku toolbelt

Getting started:

    npm install
    heroku config --shell -a existing-nodeboard-app > .env
    foreman start

## Setup instructions

- Create an S3 bucket
- Create an AWS user with access to the bucket
- Enable static website hosting for the bucket
- Optionally enable CORS for the bucket if you're developing locally
