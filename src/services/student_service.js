const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('./dbProvider')

async function getStudentByNumber(studentNumber) {
  try {
    const student = await studentDetails.find({ studentNumber: studentNumber });
    console.log(student)
    return student;
  } catch (err) {
    console.log('Error in getStudentByNumber:', err);
    throw err;
  }
}

module.exports = { getStudentByNumber };
