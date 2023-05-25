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
    await insertService.insertLecturerDetails(newData)
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
    await insertService.insertStudentDetails(newData)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// // Route for inserting new data into studentBooking collection
// router.post('/api/studentBooking', async (req, res) => {
//   try {
//     const newData = req.body // Assumes the request body contains the new data
//     // Insert the new data into the studentBooking collection
//     await insertService.insertStudentBooking(newData)
//     res.sendStatus(200)
//   } catch (err) {
//     console.error(err)
//     res.sendStatus(500)
//   }
// })

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
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({message: 'Booking created successfully'})
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'Failed to create booking'})
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

// get all the consultations for a specific lecturer.
router.get('/api/consultationDetailsSearch', async (req, res, next) => {
  const lecturerId = req.query.lecturerId;
  if (!lecturerId) {
      return res.status(400).json({ error: 'Missing lecturerId query parameter' })
  }

  try {
      const consultationDetails = await consultationService.getConsultationDetailsByLecturer(lecturerId)
      return res.json(consultationDetails)
  } catch (err) {
      next(err)
  }
});

//retrieve the database functions from the student services file.
const { getStudentByNumber, getBookingsByConsultationId } = require('../services/student_service.js');

//get a students details based on their student number.
router.get('/api/student', async (req, res) => {
  try {
    const studentNumber = req.query.studentNumber
    const studentData = await getStudentByNumber(studentNumber)
    res.json(studentData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// search for all student bookings for a specific consultation.
router.get('/api/bookingsByConsultationId', async (req, res) => {
  try {
    const consultationId = req.query.consultationId
    const bookingData = await getBookingsByConsultationId(consultationId) 
    res.json(bookingData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// create a student booking record when a student joins a consultation.
router.post('/api/studentBooking', async (req, res) => {
  try {
    const bookingDetails = req.body
    const newBooking = await insertService.insertStudentBooking(bookingDetails)
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({message: 'Booking created successfully'})
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'Failed to create booking'})
  }
});


module.exports = router
