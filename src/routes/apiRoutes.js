const path = require('path')
const express = require('express')
const logger = require("../../logger")
const router = express.Router()

// const lecturerConsultations = require('../lecturerConsultation.js').get()
// const studentConsultations = require('../studentConsultation.js').getS()

const insertService = require('../services/insert_service')
const lecturerService = require('../services/lecturer_service')
const consultationService = require('../services/consultation_service')
const consultationPeriodService = require('../services/consultation_period_service')
const studentConsulationService = require('../services/student_consulation_service')
const { getStudentByNumber, getBookingsByConsultationId } = require('../services/student_service.js') //retrieve the database functions from the student services file.

// Route for inserting new data into lecturerDetails collection
router.post('/api/lecturerDetails', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const newData = req.body
    await insertService.insertLecturerDetails(newData)
    console.log('Inserted lecturer details [' + userEmail + ']')
    logger.info('Inserted lecturer details [' + userEmail + ']')
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

// Route for inserting new data into studentDetails collection
router.post('/api/studentDetails', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const newData = req.body // Assumes the request body contains the new data
    await insertService.insertStudentDetails(newData)
    console.log('Inserted student details [' + userEmail + ']')
    logger.info('Inserted student details [' + userEmail + ']')
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

// Delete an existing consultation availability period for a lecturer
router.delete('/api/removeConsultationPeriod', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const lecturerID = req.body.lecturerID
    const dayOfWeek = req.body.dayOfWeek
    await consultationPeriodService.deleteConsultationPeriod(lecturerID, dayOfWeek)
    console.log('Deleted a consultation availability period for this lecturer [' + userEmail + ']')
    logger.info('Deleted a consultation availability period for this lecturer [' + userEmail + ']')
    res.json({ message: 'Consultation period removed successfully' })
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Route for inserting new data into consultation periods collection
router.post('/api/consultationPeriods', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const newData = req.body
    await insertService.insertConsultationPeriods(newData)
    console.log('Inserted a new consultation availability period for this lecturer [' + userEmail + ']')
    logger.info('Inserted a new consultation availability period for this lecturer [' + userEmail + ']')
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

// Define a route to handle incoming requests for getting consultation periods
router.get('/api/existingConsultationPeriods/:lecturerID', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const selectedLecturer = req.params.lecturerID
    const consultationPeriodsData = await consultationPeriodService.getExistingConsultationPeriods(selectedLecturer)
    console.log('Fetched existing consultation periods for this lecturer ' + selectedLecturer + ' [' + userEmail + ']')
    logger.info('Fetched existing consultation periods for this lecturer ' + selectedLecturer + ' [' + userEmail + ']')
    res.json(consultationPeriodsData)
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

// Route for inserting new data into consultationDetails collection
router.post('/api/consultationDetails', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const newData = req.body // Assumes the request body contains the new data
    await insertService.insertConsultationDetails(newData)
    res.setHeader('Content-Type', 'application/json')
    console.log('Organised a new consultation [' + userEmail + ']')
    logger.info('Organised a new consultation [' + userEmail + ']')
    res.status(200).json({ message: 'Booking created successfully' })
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.status(500).json({ error: 'Failed to create booking' })
  }
})

// Define a route to handle the consultation details request
router.get('/api/consultationPeriodsSearch', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const selectedLecturer = req.query.lecturerId
    const consultationPeriodsData = await lecturerService.getConsultationPeriods(selectedLecturer)
    console.log('Searched through a list of available consultation periods for this lecturer ' + selectedLecturer + ' [' + userEmail + ']')
    logger.info('Searched through a list of available consultation periods for this lecturer ' + selectedLecturer + ' [' + userEmail + ']')
    res.json(consultationPeriodsData)
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

// Define a route to handle the consultation details request
router.get('/api/lecturerDetails', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    // const selectedLecturer = req.query.lecturerId
    const lecturerDetailsData = await lecturerService.getLecturerDetails()
    console.log('Fetched lecturers details from the database [' + userEmail + ']')
    logger.info('Fetched lecturers details from the database [' + userEmail + ']')
    res.json(lecturerDetailsData)
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

// Define a route to handle the consultation details request
router.get('/api/consultationDetailSearch', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const consultationDetailsData = await consultationService.getConsultationDetails()
    console.log('Fetched consultation details from the database [' + userEmail + ']')
    logger.info('Fetched consultation details from the database [' + userEmail + ']')
    res.json(consultationDetailsData)
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

router.get('/api/consultationDetailSearchByLecID/:lecturer_id', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const lecturer_id = req.params.lecturer_id
    const consultationDetailsData = await consultationService.getConsultationDetailsByLecID(lecturer_id)
    console.log('Fetched consultation details for this lecturer ' + lecturer_id + ' from the database [' + userEmail + ']')
    logger.info('Fetched consultation details for this lecturer ' + lecturer_id + ' from the database [' + userEmail + ']')
    res.json(consultationDetailsData)
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

router.get('/api/consultationDetailSearchByID/:id', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const id = parseInt(req.params.id)
    const consultationDetailsData = await consultationService.getConsultationDetailsByID(id)
    if (!consultationDetailsData) {
      // Return a 404 Not Found response if the consultation details are not found
      res.sendStatus(404)
    } else {
      console.log('Fetched consultation details for this ' + id + ' ID from the database [' + userEmail + ']')
      logger.info('Fetched consultation details for this ' + id + ' ID from the database [' + userEmail + ']')
      res.json(consultationDetailsData)
    }
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

// Define a route to handle the consultation approval request
router.put('/api/approveConsultation/:consultationID', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const consultationID = parseInt(req.params.consultationID)
    await consultationService.approveConsultation(consultationID)
    console.log('Approved consultation with id ' + consultationID + '[' + userEmail + ']')
    logger.info('Approved consultation with id ' + consultationID + '[' + userEmail + ']')
    res.json({ message: 'Consultation approved successfully' })
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


router.delete('/api/cancelConsultation/:consultationID', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const consultationID = parseInt(req.params.consultationID)
    await consultationService.cancelConsultation(consultationID)
    console.log('Cancelled consultation with ID ' + consultationID + ' [' + userEmail + ']')
    logger.info('Cancelled consultation with ID ' + consultationID + ' [' + userEmail + ']')
    res.json({ message: 'Consultation removed successfully' })
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.get('/api/consultationPerLecturerSearch', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const selectedLecturer = req.query.lecturerId
    const consultationPerLecturerData = await consultationService.searchConsultationDetails(selectedLecturer)
    console.log('Searched through a list of available consultation periods for a lecturer [' + userEmail + ']')
    logger.info('Searched through a list of available consultation periods for a lecturer [' + userEmail + ']')
    res.json(consultationPerLecturerData)
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})
// get all the consultations for a specific lecturer.
router.get('/api/consultationDetailsSearch', async (req, res, next) => {
  const userEmail = req.oidc.user.email
  const lecturerId = req.query.lecturerId
  if (!lecturerId) {
    return res.status(400).json({ error: 'Missing lecturerId query parameter' })
  }

  try {
    const consultationDetails = await consultationService.getConsultationDetailsByLecturer(lecturerId)
    console.log('Searched through a list of available consultation periods for a lecturer [' + userEmail + ']')
    logger.info('Searched through a list of available consultation periods for a lecturer [' + userEmail + ']')
    return res.json(consultationDetails)
  } catch (err) {
    next(err)
  }
})

//get a students details based on their student number.
router.get('/api/student', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const studentNumber = req.query.studentNumber
    const studentData = await getStudentByNumber(studentNumber)
    console.log('Fetched student (' + studentNumber + ') details from the database [' + userEmail + ']')
    logger.info('Fetched student (' + studentNumber + ') details from the database [' + userEmail + ']')
    res.json(studentData)
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

// search for all student bookings for a specific consultation.
router.get('/api/bookingsByConsultationId', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const consultationId = req.query.consultationId
    const bookingData = await getBookingsByConsultationId(consultationId)
    console.log('Fetched all bookings for consultation (' + consultationId + ') from the database [' + userEmail + ']')
    logger.info('Fetched all bookings for consultation (' + consultationId + ') from the database [' + userEmail + ']')
    res.json(bookingData)
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

// create a student booking record when a student joins a consultation.
router.post('/api/studentBooking', async (req, res) => {
  const userEmail = req.oidc.user.email
  try {
    const bookingDetails = req.body
    const newBooking = await insertService.insertStudentBooking(bookingDetails)
    console.log('Student joined an existing consultation [' + userEmail + ']')
    logger.info('Student joined an existing consultation [' + userEmail + ']')
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ message: 'Booking created successfully' })
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.status(500).json({ error: 'Failed to create booking' })
  }
})

// get all the bookings for a specific student.
router.get('/api/studentConsultationDetails', async (req, res) => {
  try {
    const userEmail = req.oidc.user.email
    const studentConsultationDetails = await studentConsulationService.getStudentConsultationDetails(userEmail)
    console.log('Fetched all bookings/consultations for this student [' + userEmail + ']')
    logger.info('Fetched all bookings/consultations for this student [' + userEmail + ']')
    res.json(studentConsultationDetails)
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

router.get('/api/studentDetails', async (req, res) => {
  try {
    const userEmail = req.oidc.user.email
    if (!userEmail) {
      return res.status(400).json({ error: 'Missing userEmail query parameter' })
    }
    if (userEmail.includes('@students.wits.ac.za')) {
      const studentDetails = await studentConsulationService.getStudentDetails(userEmail)
      console.log('Fetched student details [' + userEmail + ']')
      logger.info('Fetched student details [' + userEmail + ']')
      res.json(studentDetails)
    }
    else {
      return res.status(400).json({ error: 'Invalid email address, not logged in as student' })
    }

  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})

router.get('/api/userStudentNumber', async (req, res) => {
  try {
    const userEmail = req.oidc.user.email
    if (!userEmail) {
      return res.status(400).json({ error: 'Missing userEmail query parameter' })
    }
    if (userEmail.includes('@students.wits.ac.za')) {
      const studentDetails = await studentConsulationService.getStudentDetails(userEmail)
      console.log('Fetched student number for this student [' + userEmail + ']')
      logger.info('Fetched student number for this student [' + userEmail + ']')
      res.json(studentDetails[0].studentNumber)
    }
    else {
      return res.status(400).json({ error: 'Invalid email address, not logged in as student' })
    }
  } catch (err) {
    console.error(err)
    logger.error(err)
    res.sendStatus(500)
  }
})


module.exports = router