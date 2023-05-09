const path = require('path')
const express = require('express')
const logger = require("../../logger");

const mainRouter = express.Router()
mainRouter.get('/', function (req, res) {
  logger.info('Navigated to landing page [unknown user]');
  res.sendFile(path.join(__dirname, '../../index.html'))
})

module.exports = mainRouter