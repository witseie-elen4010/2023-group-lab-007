const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('./dbProvider')

//Function that deletes a consultation period
async function deleteConsultationPeriod(lecturerID, dayOfWeek) {
  try {
    await consultationPeriods.deleteOne({ lecturerId: lecturerID, dayOfWeek: dayOfWeek });
  } catch (err) {
    console.error(err);
    throw err; // Throw the error to handle it in the calling function
  }
}

//Function that retrieves existing consultation periods for that lecturer
async function getExistingConsultationPeriods(lecturerID) {
  try {
    const periods = await consultationPeriods.find({ lecturerId: lecturerID });
    return periods;
  } catch (err) {
    console.error(err);
    throw err; // Throw the error to handle it in the calling function
  }
}

module.exports = { deleteConsultationPeriod, getExistingConsultationPeriods };