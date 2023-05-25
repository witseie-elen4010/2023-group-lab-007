const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('./dbProvider')
const studentConsultationPipeline = require('../controllers/studentConsultationPipeline')

async function getStudentConsultationDetails(studentNumber) {
    try {
      const consultationDetailsStudentData = await consultationDetails.aggregate(studentConsultationPipeline(studentNumber))
      return consultationDetailsStudentData
    } catch (err) {
      console.error(err);
      throw err; // Throw the error to handle it in the calling function
    }
  }

module.exports = {getStudentConsultationDetails};