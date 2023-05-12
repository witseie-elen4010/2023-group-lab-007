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
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
      });
      logger.info('Navigated to lecturer dashboard page [' + userEmail + ']');
    } else if (userEmail.includes('@students.wits.ac.za')) {
      res.render('student_dashboard', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
      });
      logger.info('Navigated to student dashboard page [' + userEmail + ']');
    } else {
      res.render('notamember', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
      });
      logger.info('Navigated to notamember page [' + userEmail + ']');
    }
  } else {
    res.redirect('/login');
  }
  
})
router.get('/lecturer_dashboard', function (req, res) {
  res.render('lecturer_dashboard', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
  });
  // res.sendFile(path.join(__dirname, '../views', 'lecturer_dashboard.html'))
  logger.info('Navigated to lecturer dashboard page [unknown user]');
})
router.get('/student_dashboard', function (req, res) {
  res.render('student_dashboard', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
  });
  logger.info('Navigated to student dashboard page [unknown user]');
})

router.get('/loginorsignup', function (req, res) {
  logger.info('Navigated to login page [unknown user]');
  //Make this user object public to all views at a later stage
  res.render('loginorsignup', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
  });
})
router.get('/settings', function (req, res) {
  res.render('settings', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
  });
  logger.info('Navigated to settings page [unknown user]');
})
router.get('/create_consultation', function (req, res) {
  res.render('create_consultation', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
  });
  logger.info('Navigated to create consultation page [unknown user]');
})

router.get('/loggedin', function (req, res) {
  const isAuthenticated = req.oidc.isAuthenticated()

  if (isAuthenticated) {
    const userEmail = req.oidc.user.email;
    if (userEmail.includes('@wits.co.za')) {
      res.render('lecturer_dashboard', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
      });
      logger.info('Navigated to lecturer dashboard page [' + userEmail + ']');
    } else if (userEmail.includes('@students.wits.ac.za')) {
      res.render('student_dashboard', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
      });
      logger.info('Navigated to student dashboard page [' + userEmail + ']');
    } else {
      res.render('notamember', {
        isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
      });
      logger.info('Navigated to notamember page [' + userEmail + ']');
    }
  }
  else {
    res.render('notamember', {
      isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
    });
    logger.info('Navigated to notamember page [unknown user]');
  }

});

router.get('/api/studentConsultations', function (req, res) {
  res.json(studentConsultations) // Respond with JSON
})

router.get('/api/lecturerConsultations', function (req, res) {
  res.json(lecturerConsultations) // Respond with JSON
})


// EXAMPLE CODE FOR RESTFUL API
// //RESTFUL API                                     //Replace these with async ones in public scripts folder for exercise 7
// router.get('/api/list', function (req, res) {
//   res.json(classList.all()) // Respond with JSON
// })

// router.get('/api/get/:id', function (req, res) {
//   res.json(classList.get(req.params.id)) // Notice the wildcard in the URL?
//   
// })
// router.post('/api/create', function (req, res) {
//   console.log('Adding the following student:', req.body.student)
//   classList.add(req.body.student)
//   res.redirect(req.baseUrl)
// })
// router.post('/api/delete', function (req, res) {
//   const id = req.body.studentID
//   console.log('this will delete a student entry:', id)
//   if (id !== -1) {
//     classList.delete(id)
//   }
//   res.redirect(req.baseUrl + '/delete')
// })

// router.post('/api/edit', function (req, res) {
//   const id = req.body.studentID
//   console.log('this will edit a student entry:', id)
//   classList.edit(req.body.student, id)
//   res.redirect(req.baseUrl + '/edit')
// })

module.exports = router
