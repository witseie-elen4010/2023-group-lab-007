const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('./dbProvider')
const examplePipeline = require('../controllers/examplePipeline')

// Function to insert new data into the consultationPeriods collection
async function getConsultationDetails() {
  try {
    const consultationDetailsData = await consultationDetails.find({});
    return consultationDetailsData;
  } catch (err) {
    console.error(err);
    throw err; // Throw the error to handle it in the calling function
  }
}

async function deleteConsultation(consultationID) {
  try {
    await consultationDetails.deleteOne({ consultationId: consultationID });
  } catch (err) {
    console.error(err);
    throw err; // Throw the error to handle it in the calling function
  }
}

async function getMoreDetails() {
  try {
    const consultationDetailsData = await consultationDetails.aggregate(examplePipeline)
    return consultationDetailsData;
  } catch (err) {
    console.error(err);
    throw err; // Throw the error to handle it in the calling function
  }
}



module.exports = { getConsultationDetails, deleteConsultation, getMoreDetails};