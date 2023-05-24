const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('./dbProvider')

// Function to check if student is in the database
async function inDatabaseStudent(emailAddress) {
  try {
    const status = await studentDetails.find({ emailAddress: emailAddress });
    console.log(status);
    if (status.length === 0) {
      return false; // change this to false when you have the database
    }
    else {
      return true;
    }
  } catch (err) {
    console.error(err);
    throw err; // Throw the error to handle it in the calling function
  }
}

// Function to insert new data into the consultationPeriods collection
async function inDatabaseLecturer(emailAddress) {
  try {
    const status = await lecturerDetails.find({ emailAddress: emailAddress });
    console.log(status);
    if (status.length === 0) {
      return false; // change this to false when you have the database
    }
    else {
      return true;
    }
  } catch (err) {
    console.error(err);
    throw err; // Throw the error to handle it in the calling function
  }
}

module.exports = { inDatabaseLecturer, inDatabaseStudent };