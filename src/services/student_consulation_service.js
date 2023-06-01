const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('./dbProvider')
const studentConsultationPipeline = require('../controllers/studentConsultationPipeline')
const studentDetailsPipeline = require('../controllers/studentDetailsPipeline')
async function getStudentConsultationDetails(email) {
    try {
      const studentDetailsData = await studentDetails.aggregate(studentDetailsPipeline(email))
      const studentNumber = studentDetailsData[0].studentNumber
      const consultationDetailsStudentData = await consultationDetails.aggregate(studentConsultationPipeline(studentNumber))
      return consultationDetailsStudentData
    } catch (err) {
      console.error('An error occurred in getStudentConsultationDetails:', err)
      throw new Error('Failed to get student consultation details')
    }
  }

//function to return the details of student
async function getStudentDetails(email) {
    try {
      const studentDetailsData = await studentDetails.aggregate(studentDetailsPipeline(email))
      return studentDetailsData
    } catch (err) {
      console.error('An error occurred in getStudentDetails:', err)
      throw new Error('Failed to get student details')
    }
  }


module.exports = {getStudentConsultationDetails, getStudentDetails}