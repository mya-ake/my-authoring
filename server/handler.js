'use strict'

const awsServerlessExpress = require('aws-serverless-express')
const { app } = require('./app')

const server = awsServerlessExpress.createServer(app)

module.exports.handler = (event, context, callback) => {
  // eslint-disable-next-line
  console.log(event)
  awsServerlessExpress.proxy(server, event, context)
}
