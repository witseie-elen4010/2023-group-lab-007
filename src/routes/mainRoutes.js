const path = require('path')
const express = require('express')

const mainRouter = express.Router()
mainRouter.get('/', function (req, res) {
  console.log(req.oidc.isAuthenticated());
  res.sendFile(path.join(__dirname, '../../index.html'))
})

module.exports = mainRouter