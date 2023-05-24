const path = require('path')
const express = require('express')
const logger = require("../../logger");
const router = express.Router()
const moreDetailsService = require('../services/more_details_service')
var inDatabase = false;

//Home route
router.get('/', async (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated()

  if (isAuthenticated) {
    const userEmail = req.oidc.user.email;
    if (userEmail.includes('@wits.ac.za')) {
      inDatabase = await moreDetailsService.inDatabaseLecturer(userEmail);
      if (inDatabase) {
        res.render('lecturer_dashboard', {                                                                       
          isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
        });
        logger.info('Navigated to landing page [' + userEmail + ']');
      }
      else {
        res.render('moreDetails', {
          isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
        });
        logger.info('Navigated to more details page [' + userEmail + ']');
      }

    } else if (userEmail.includes('@students.wits.ac.za')) {
      inDatabase = await moreDetailsService.inDatabaseStudent(userEmail);
      if (inDatabase) {
        res.render('student_dashboard', {                                                                       
          isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
        });
        logger.info('Navigated to landing page [' + userEmail + ']');

      }
      else {
        res.render('moreDetails', {
          isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
        });
        logger.info('Navigated to more details page [' + userEmail + ']');
      }

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
    if (userEmail.includes('@wits.ac.za')) {
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

// router.get('/lecturer_dashboard', function (req, res) {
//   const isAuthenticated = req.oidc.isAuthenticated()
//   const userEmail = req.oidc.user.email;

//   res.render('lecturer_dashboard', {
//     isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
//   });
//   logger.info('Navigated to lecturer dashboard page [' + userEmail + ']');
// })

// router.get('/student_dashboard', function (req, res) {
//   const isAuthenticated = req.oidc.isAuthenticated()
//   const userEmail = req.oidc.user.email;

//   res.render('student_dashboard', {
//     isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
//   });
//   logger.info('Navigated to student dashboard page [' + userEmail + ']');
// })

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

//Route for lecturer settings
router.get('/settings', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()
  const userEmail = req.oidc.user.email;

  res.render('settings', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "lecturer",
  });
  logger.info('Navigated to settings page [' + userEmail + ']');
})

// router.get('/create_consultation', function (req, res) {
//   const isAuthenticated = req.oidc.isAuthenticated()
//   const userEmail = req.oidc.user.email;

//   //Replace with this on final version
//   // if (userEmail.includes('@students.wits.co.za')) {
//   //   res.render('create_consultation', {
//   //     isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
//   //   });
//   //   logger.info('Navigated to lecturer dashboard page [' + userEmail + ']');
//   // } else {
//   //   res.render('notamember', {
//   //     isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "other",
//   //   });
//   //   logger.info('Navigated to notamember page [' + userEmail + ']');
//   // }

//   res.render('create_consultation', {
//     isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, roll: "student",
//   });
//   logger.info('Navigated to create consultation page [' + userEmail + ']');
// })

module.exports = router