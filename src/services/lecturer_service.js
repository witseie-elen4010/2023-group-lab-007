const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('./dbProvider')

// Function to insert new data into the consultationPeriods collection
async function getConsultationPeriods(selectedLecturer) {
  try {
    const consultationPeriodsData = await consultationPeriods.find({ lecturerId: selectedLecturer });
    return consultationPeriodsData;
  } catch (err) {
    console.error(err);
    throw err; // Throw the error to handle it in the calling function
  }
}

async function getLecturerDetails() {
  try {
    const lecturerDetailsData = await lecturerDetails.find({});
    return lecturerDetailsData;
  } catch (err) {
    console.error(err);
    throw err; // Throw the error to handle it in the calling function
  }
}

module.exports = { getConsultationPeriods, getLecturerDetails };