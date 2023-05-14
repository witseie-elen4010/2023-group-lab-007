const path = require('path')
const express = require('express')
const router = express.Router()
const logger = require("../../logger");
const lecturerConsultations = require('../lecturerConsultation.js').get();
const studentConsultations = require('../studentConsultation.js').getS();

router.get('/', function (req, res) {
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

router.get('/lecturer_dashboard', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()
  const userEmail = req.oidc.user.email;

  //Replace with this on final version
  // if (userEmail.includes('@wits.co.za')) {
  //   res.render('lecturer_dashboard', {
  //     isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
  //   });
  //   logger.info('Navigated to lecturer dashboard page [' + userEmail + ']');
  // } else {
  //   res.render('notamember', {
  //     isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "other",
  //   });
  //   logger.info('Navigated to notamember page [' + userEmail + ']');
  // }

  res.render('lecturer_dashboard', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
  });
  logger.info('Navigated to lecturer dashboard page [' + userEmail + ']');
})

router.get('/student_dashboard', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()
  const userEmail = req.oidc.user.email;

  //Replace with this on final version
  // if (userEmail.includes('@students.wits.co.za')) {
  //   res.render('student_dashboard', {
  //     isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
  //   });
  //   logger.info('Navigated to lecturer dashboard page [' + userEmail + ']');
  // } else {
  //   res.render('notamember', {
  //     isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "other",
  //   });
  //   logger.info('Navigated to notamember page [' + userEmail + ']');
  // }

  res.render('student_dashboard', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
  });
  logger.info('Navigated to student dashboard page [' + userEmail + ']');
})

router.get('/loginorsignup', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()
  const userEmail = req.oidc.user.email;

  logger.info('Navigated to login page [' + userEmail + ']');
  //Make this user object public to all views at a later stage
  res.render('loginorsignup', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
  });
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

router.get('/api/studentConsultations', function (req, res) {
  res.json(studentConsultations) // Respond with JSON
})

router.get('/api/lecturerConsultations', function (req, res) {
  res.json(lecturerConsultations) // Respond with JSON
})

module.exports = router
