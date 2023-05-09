const path = require('path')
const express = require('express')
const router = express.Router()
const logger = require("../../logger");

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../index.html'))
  logger.info('Navigated to landing page [unknown user]');
})
router.get('/lecturer_dashboard', function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'lecturer_dashboard.html'))
  logger.info('Navigated to lecturer dashboard page [unknown user]');
})
router.get('/student_dashboard', function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'student_dashboard.html'))
  logger.info('Navigated to student dashboard page [unknown user]');
})
router.get('/login', function (req, res) {
  logger.info('Navigated to login page [unknown user]');
  //Make this user object public to all views at a later stage
  res.render('login', {
    isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user,
  });
})
router.get('/settings', function (req, res) {
  logger.info('Navigated to settings page [unknown user]');
  res.sendFile(path.join(__dirname, '../views', 'settings.html'))
})
router.get('/create_consultation', function (req, res) {
  logger.info('Navigated to create consultation page [unknown user]');
  res.sendFile(path.join(__dirname, '../views', 'create_consultation.html'))
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
