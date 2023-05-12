const path = require('path')
const express = require('express')
const logger = require("../../logger");

const mainRouter = express.Router()
mainRouter.get('/', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()

  if (isAuthenticated) {
    const userEmail = req.oidc.user.email;
    if (userEmail.includes('@wits.co.za')) {
      res.render('index', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
      });
      logger.info('Navigated to landing page [' + userEmail + ']');
    } else if (userEmail.includes('@students.wits.ac.za')) {
      res.render('index', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
      });
      logger.info('Navigated to landing page [' + userEmail + ']');
    } else {
      res.render('notamember', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "other",
      });
      logger.info('Navigated to notamember page [' + userEmail + ']');
    }
  } else {
    res.redirect('/login');
  }
})

module.exports = mainRouter