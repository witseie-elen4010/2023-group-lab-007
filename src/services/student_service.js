const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('./dbProvider')

// Function to get a students details by their student number. 
async function getStudentByNumber(studentNumber) {
  try {
    const student = await studentDetails.find({ studentNumber: studentNumber })
    return student
  } catch (err) {
    console.error('An error occurred in getStudentByNumber:', err)
    throw new Error('Failed to get student details')
  }
}

// Function to bookings for a specific consultationId.
async function getBookingsByConsultationId(consultationId) {
    try {
      const studentBookings = await studentBooking.find({ consultationId: consultationId })
      return studentBookings
    } catch (err) {
      console.error('An error occurred in getBookingsByConsultationId:', err)
      throw new Error('Failed to get student Bookings')
    }
  }

  
module.exports = { getStudentByNumber, getBookingsByConsultationId }
  
