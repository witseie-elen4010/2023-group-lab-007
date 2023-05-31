const path = require('path')
const express = require('express')
const logger = require("../../logger");
const router = express.Router()
const moreDetailsService = require('../services/more_details_service');
const { isStudent, isLecturer } = require('../services/login_service');
var inDatabase = false;

//Home route
router.get('/', async (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated()

  if (isAuthenticated) {
    const userEmail = req.oidc.user.email;
    if (isLecturer(userEmail)) {
      inDatabase = await moreDetailsService.inDatabaseLecturer(userEmail);
      if (inDatabase) {
        res.render('lecturer_dashboard', {
          isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
        });
        console.log('Navigated to landing page [' + userEmail + ']');
        logger.info('Navigated to landing page [' + userEmail + ']');
      }
      else {
        res.render('moreDetails', {
          isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
        });
        console.log('Navigated to more details page [' + userEmail + ']');
        logger.info('Navigated to more details page [' + userEmail + ']');
      }

    } else if (isStudent(userEmail)) {
      inDatabase = await moreDetailsService.inDatabaseStudent(userEmail);
      if (inDatabase) {
        res.render('student_dashboard', {
          isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
        });
        console.log('Navigated to landing page [' + userEmail + ']');
        logger.info('Navigated to landing page [' + userEmail + ']');
      }
      else {
        res.render('moreDetails', {
          isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
        });
        console.log('Navigated to more details page [' + userEmail + ']');
        logger.info('Navigated to more details page [' + userEmail + ']');
      }

    } else {
      res.render('notamember', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "other",
      });
      console.log('Navigated to notamember page [' + userEmail + ']');
      logger.info('Navigated to notamember page [' + userEmail + ']');

    }
  } else {
    res.redirect('/login');
  }
})

//Route for obtaining more personal details
router.get('/moreDetails', async (req, res) => {
  try {
    res.render('moreDetails', {
      isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
    });
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

//Route for lecturer or student dashboard
router.get('/dashboard', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()

  if (isAuthenticated) {
    const userEmail = req.oidc.user.email;
    if (isLecturer(userEmail)) {
      res.render('lecturer_dashboard', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
      });
      console.log('Navigated to lecturer dashboard page [' + userEmail + ']');
      logger.info('Navigated to lecturer dashboard page [' + userEmail + ']');

    } else if (isStudent(userEmail)) {
      res.render('student_dashboard', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
      });
      console.log('Navigated to student dashboard page [' + userEmail + ']');
      logger.info('Navigated to student dashboard page [' + userEmail + ']');

    } else {
      res.render('notamember', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "other",
      });
      console.log('Navigated to notamember page [' + userEmail + ']');
      logger.info('Navigated to notamember page [' + userEmail + ']');

    }
  } else {
    res.redirect('/login');
  }
})

router.get('/loginorlogout', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()
  const userEmail = req.oidc.user.email;
  if (isAuthenticated) {
    console.log('Logged out [' + userEmail + ']');
    logger.info('Logged out [' + userEmail + ']');
    res.redirect('/logout');
  }
  else {
    console.log('Navigated to login page [' + userEmail + ']');
    logger.info('Navigated to login page [' + userEmail + ']');
    res.redirect('/login');
  }
})

//Route for lecturer settings
router.get('/settings', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()
  const userEmail = req.oidc.user.email;

  res.render('settings', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
  });
  console.log('Navigated to settings page [' + userEmail + ']');
  logger.info('Navigated to settings page [' + userEmail + ']');

})

module.exports = router