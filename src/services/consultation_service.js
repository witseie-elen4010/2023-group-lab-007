const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('./dbProvider')
const examplePipeline = require('../controllers/examplePipeline')

// Function to get all consultations
async function getConsultationDetails() {
  try {
    const consultationDetailsData = await consultationDetails.find({})
    return consultationDetailsData
  } catch (err) {
    console.error(err)
    throw err // Throw the error to handle it in the calling function
  }
}

async function getConsultationDetailsByLecID(lecturer_id) {
  try {
    const consultationDetailsData = await consultationDetails.find({ lecturerId: lecturer_id })
    return consultationDetailsData
  } catch (err) {
    console.error(err)
    throw err // Throw the error to handle it in the calling function
  }
}

async function getConsultationDetailsByID(id) {
  try {
    const consultationDetailsData = await consultationDetails.find({ consultationId: id })
    return consultationDetailsData
  } catch (err) {
    console.error(err)
    throw err // Throw the error to handle it in the calling function
  }
}

async function approveConsultation(consultationID) {
  try {
    await consultationDetails.updateOne(
      { consultationId: consultationID },
      { $set: { status: "approved" } }
    )
  } catch (err) {
    console.error(err)
    throw err // Throw the error to handle it in the calling function
  }
}

async function cancelConsultation(consultationID) {
  try {
    await consultationDetails.updateOne(
      { consultationId: consultationID },
      { $set: { status: "disapproved" } }
    )
  } catch (err) {
    console.error(err)
    throw err // Throw the error to handle it in the calling function
  }
}

async function getMoreDetails() {
  try {
    const consultationDetailsData = await consultationDetails.aggregate(examplePipeline)
    return consultationDetailsData
  } catch (err) {
    console.error(err)
    throw err // Throw the error to handle it in the calling function
  }
}

async function searchConsultationDetails(selectedLecturer) {
  try {
    const consultationPeriodsData = await consultationDetails.find({ lecturerId: selectedLecturer })
    return consultationPeriodsData
  } catch (err) {
    console.error(err)
    throw err // Throw the error to handle it in the calling function
  }
}
// Function to get consultation details for a specific lecturer
async function getConsultationDetailsByLecturer(lecturerId) {
  try {
    const consultationDetailsData = await consultationDetails.find({ lecturerId: lecturerId })
    return consultationDetailsData
  } catch (err) {
    console.error(err)
    throw err // Throw the error to handle it in the calling function
  }
}

module.exports = { getConsultationDetails, getConsultationDetailsByLecID, getConsultationDetailsByID, approveConsultation, cancelConsultation, getMoreDetails, searchConsultationDetails, getConsultationDetailsByLecturer}