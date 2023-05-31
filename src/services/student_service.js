const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('./dbProvider')

// Function to get a students details by their student number. 
async function getStudentByNumber(studentNumber) {
  try {
    const student = await studentDetails.find({ studentNumber: studentNumber });
    return student;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Function to bookings for a specific consultationId.
async function getBookingsByConsultationId(consultationId) {
    try {
      const studentBookings = await studentBooking.find({ consultationId: consultationId });
      return studentBookings;
    } catch (err) {
      console.error(err);
      throw err; // Throw the error to handle it in the calling function
    }
  }

  
module.exports = { getStudentByNumber, getBookingsByConsultationId };
  
