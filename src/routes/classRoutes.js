const path = require('path')
const express = require('express')
const logger = require("../../logger");
const router = express.Router()
//Remove this later
const lecturerConsultations = require('../lecturerConsultation.js').get();
const studentConsultations = require('../studentConsultation.js').getS();

const { lecturerDetails, consultationDetails, consultationPeriods, studentBooking, studentDetails } = require('../services/dbProvider');
const insertData = require('../services/insert');

router.get('/api/studentConsultations', function (req, res) {
  res.json(studentConsultations) // Respond with JSON
})

router.get('/api/lecturerConsultations', function (req, res) {
  res.json(lecturerConsultations) // Respond with JSON
})

// Route for inserting new data into lecturerDetails collection
router.post('/api/lecturerDetails', async (req, res) => {
  try {
    const newData = req.body // Assumes the request body contains the new data

    // Insert the new data into the lecturerDetails collection
    await insertData.insertLecturerDetails(newData)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Route for inserting new data into studentDetails collection
router.post('/api/studentDetails', async (req, res) => {
  try {
    const newData = req.body // Assumes the request body contains the new data

    // Insert the new data into the studentDetails collection
    await insertData.insertStudentDetails(newData)

    res.sendStatus(200)
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
    await insertData.insertStudentBooking(newData)

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
    await insertData.insertConsultationPeriods(newData)

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
    const consultationPeriodsData = await consultationPeriods.find({ lecturerId: selectedLecturer })
    res.json(consultationPeriodsData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Define a route to handle the consultation details request
router.get('/api/lecturerDetails', async (req, res) => {
  try {
    const lecturerDetailsData = await lecturerDetails.find({})
    res.json(lecturerDetailsData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Define a route to handle the consultation details request
router.get('/api/consultationDetailSearch', async (req, res) => {
  try {
    const consultationDetailsData = await consultationDetails.find({})
    res.json(consultationDetailsData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.delete('/api/removeConsultation/:consultationID', async (req, res) => {
  try {
    const consultationID = parseInt(req.params.consultationID);
    await consultationDetails.deleteOne({ consultationId: consultationID });
    res.json({ message: 'Consultation removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for inserting new data into consultationDetails collection
router.post('/api/consultationDetails', async (req, res) => {
  try {
    const newData = req.body // Assumes the request body contains the new data

    // Insert the new data into the consultationDetails collection
    await insertData.insertConsultationDetails(newData)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

module.exports = router
