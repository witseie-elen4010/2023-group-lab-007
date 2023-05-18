const path = require('path')
const express = require('express')
const logger = require("../../logger");
const router = express.Router()

router.get('/', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()

  if (isAuthenticated) {
    const userEmail = req.oidc.user.email;
    if (userEmail.includes('@wits.co.za')) {
      res.render('lecturer_dashboard', {                                                                        //Change this to lecturer_dashboard after the nabar has been implimented
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
      });
      logger.info('Navigated to landing page [' + userEmail + ']');
    } else if (userEmail.includes('@students.wits.ac.za')) {
      res.render('student_dashboard', {                                                                       //Change this to student_dashboard after the nabar has been implimented
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

router.get('/dashboard', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()

  if (isAuthenticated) {
    const userEmail = req.oidc.user.email;
    if (userEmail.includes('@wits.co.za')) {
      res.render('lecturer_dashboard', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
      });
      logger.info('Navigated to lecturer dashboard page [' + userEmail + ']');
    } else if (userEmail.includes('@students.wits.ac.za')) {
      res.render('student_dashboard', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
      });
      logger.info('Navigated to student dashboard page [' + userEmail + ']');
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

//Replace [delete] these two dashboard with the one above at a later stage

router.get('/lecturer_dashboard', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()
  const userEmail = req.oidc.user.email;

  res.render('lecturer_dashboard', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
  });
  logger.info('Navigated to lecturer dashboard page [' + userEmail + ']');
})

router.get('/student_dashboard', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()
  const userEmail = req.oidc.user.email;

  res.render('student_dashboard', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
  });
  logger.info('Navigated to student dashboard page [' + userEmail + ']');
})

router.get('/loginorlogout', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()
  const userEmail = req.oidc.user.email;
  if (isAuthenticated) {
    logger.info('Logged out [' + userEmail + ']');
    res.redirect('/logout');
  }
  else {
    logger.info('Navigated to login page [' + userEmail + ']');
    res.redirect('/login');
  }
})

router.get('/settings', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()
  const userEmail = req.oidc.user.email;

  res.render('settings', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
  });
  logger.info('Navigated to settings page [' + userEmail + ']');
})

router.get('/create_consultation', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()
  const userEmail = req.oidc.user.email;

  //Replace with this on final version
  // if (userEmail.includes('@students.wits.co.za')) {
  //   res.render('create_consultation', {
  //     isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
  //   });
  //   logger.info('Navigated to lecturer dashboard page [' + userEmail + ']');
  // } else {
  //   res.render('notamember', {
  //     isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "other",
  //   });
  //   logger.info('Navigated to notamember page [' + userEmail + ']');
  // }

  res.render('create_consultation', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
  });
  logger.info('Navigated to create consultation page [' + userEmail + ']');
})

module.exports = router