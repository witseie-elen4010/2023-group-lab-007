const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('./dbProvider')

async function deleteConsultationPeriod(lecturerID, dayOfWeek) {
  try {
    await consultationPeriods.deleteOne({ lecturerId: lecturerID, dayOfWeek: dayOfWeek });
  } catch (err) {
    console.error(err);
    throw err; // Throw the error to handle it in the calling function
  }
}

module.exports = { deleteConsultationPeriod };