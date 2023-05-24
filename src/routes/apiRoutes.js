const path = require('path')
const express = require('express')
const logger = require("../../logger");
const router = express.Router()
//Remove this later
const lecturerConsultations = require('../lecturerConsultation.js').get();
const studentConsultations = require('../studentConsultation.js').getS();

const insertService = require('../services/insert_service');
const lecturerService = require('../services/lecturer_service');
const consultationService = require('../services/consultation_service');
const consultationPeriodService = require('../services/consultation_period_service');

router.get('/api/studentConsultations', function (req, res) {
  res.json(studentConsultations) // Respond with JSON
})

router.get('/api/lecturerConsultations', function (req, res) {
  res.json(lecturerConsultations) // Respond with JSON
})

// Route for inserting new data into lecturerDetails collection
router.post('/api/lecturerDetails', async (req, res) => {
  const userEmail = req.oidc.user.email;
  try {
    const newData = req.body
    // Insert the new data into the lecturerDetails collection
    await insertService.insertLecturerDetails(newData)
    logger.info('Inserted lecturer details [' + userEmail + ']');
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Route for inserting new data into studentDetails collection
router.post('/api/studentDetails', async (req, res) => {
  const userEmail = req.oidc.user.email;
  try {
    const newData = req.body // Assumes the request body contains the new data
    // Insert the new data into the studentDetails collection
    await insertService.insertStudentDetails(newData)
    logger.info('Inserted student details [' + userEmail + ']');
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Delete an existing consultation availability period for a lecturer
router.delete('/api/removeConsultationPeriod', async (req, res) => {
  const userEmail = req.oidc.user.email;
  try {
    const lecturerID = req.body.lecturerID;
    const dayOfWeek = req.body.dayOfWeek;
    await consultationPeriodService.deleteConsultationPeriod(lecturerID, dayOfWeek);
    logger.info('Deleted a consultation availability period [' + userEmail + ']');
    res.json({ message: 'Consultation period removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for inserting new data into consultation periods collection
router.post('/api/consultationPeriods', async (req, res) => {
  const userEmail = req.oidc.user.email;
  try {
    const newData = req.body
    // Insert the new data into the lecturerDetails collection
    await insertService.insertConsultationPeriods(newData)
    logger.info('Inserted a new consultation availability period [' + userEmail + ']');
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Define a route to handle incoming requests for getting consultation periods
router.get('/api/existingConsultationPeriods/:lecturerID', async (req, res) => {
  const userEmail = req.oidc.user.email;
  try {
    const selectedLecturer = req.params.lecturerID;
    const consultationPeriodsData = await consultationPeriodService.getExistingConsultationPeriods(selectedLecturer);
    logger.info('fetched existing consultation periods for lecturer [' + userEmail + ']');
    res.json(consultationPeriodsData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})


// Route for inserting new data into studentBooking collection
router.post('/api/studentBooking', async (req, res) => {
  try {
    const newData = req.body // Assumes the request body contains the new data
    // Insert the new data into the studentBooking collection
    await insertService.insertStudentBooking(newData)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Route for inserting new data into consultationPeriods collection
router.post('/api/consultationPeriods', async (req, res) => {
  try {
    const newData = req.body // Assumes the request body contains the new data
    // Insert the new data into the consultationPeriods collection
    await insertService.insertConsultationPeriods(newData)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})


// Route for inserting new data into consultationDetails collection
router.post('/api/consultationDetails', async (req, res) => {
  try {
    const newData = req.body // Assumes the request body contains the new data
    // Insert the new data into the consultationDetails collection
    await insertService.insertConsultationDetails(newData)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Define a route to handle the consultation details request
router.get('/api/consultationPeriodsSearch', async (req, res) => {
  try {
    const selectedLecturer = req.query.lecturerId
    const consultationPeriodsData = await lecturerService.getConsultationPeriods(selectedLecturer);
    res.json(consultationPeriodsData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Define a route to handle the consultation details request
router.get('/api/lecturerDetails', async (req, res) => {
  try {
    // const selectedLecturer = req.query.lecturerId
    const lecturerDetailsData = await lecturerService.getLecturerDetails()
    res.json(lecturerDetailsData)
  } catch (err) {
    console.error(err);
    res.sendStatus(500)
  }
})

// Define a route to handle the consultation details request
router.get('/api/consultationDetailSearch', async (req, res) => {
  try {
    const consultationDetailsData = await consultationService.getConsultationDetails()
    res.json(consultationDetailsData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.delete('/api/removeConsultation/:consultationID', async (req, res) => {
  try {
    const consultationID = parseInt(req.params.consultationID);
    await consultationService.deleteConsultation(consultationID);
    res.json({ message: 'Consultation removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/testPipeline', async (req, res) => {
  try {
    const consultationDetailsData = await consultationService.getMoreDetails();
    res.json(consultationDetailsData);
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})


module.exports = router
