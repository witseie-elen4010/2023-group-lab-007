const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('./dbProvider')
// Function to insert new data into the lecturerDetails collection
async function insertLecturerDetails(newData) {
  try {
    const document = new lecturerDetails(newData)
    await document.save()
  } catch (err) {
    console.error('Failed to insert new data into lecturerDetails collection.', err)
  }
}

// Function to insert new data into the studentDetails collection
async function insertStudentDetails(newData) {
  try {
    const document = new studentDetails(newData)
    await document.save()
  } catch (err) {
    console.error('Failed to insert new data into studentDetails collection.', err)
  }
}

// Function to insert new data into the consultationDetails collection
async function insertConsultationDetails(newData) {
  try {
    const document = new consultationDetails(newData)
    await document.save()
  } catch (err) {
    console.error('Failed to insert new data into consultationDetails collection.', err)
  }
}

// Function to insert new data into the studentBooking collection
async function insertStudentBooking(newData) {
  try {
    const document = new studentBooking(newData)
    await document.save()
    console.log('New data inserted into studentBooking collection.')
  } catch (err) {
    console.error('Failed to insert new data into studentBooking collection.', err)
  }
}

// Function to insert new data into the consultationPeriods collection
async function insertConsultationPeriods(newData) {
  try {
    const document = new consultationPeriods(newData)
    await document.save()
    console.log('New data inserted into consultationPeriods collection.')
  } catch (err) {
    console.error('Failed to insert new data into consultationPeriods collection.', err)
  }
}

module.exports = {
  insertLecturerDetails,
  insertStudentDetails,
  insertConsultationDetails,
  insertStudentBooking,
  insertConsultationPeriods
}
