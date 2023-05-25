const mongoose = require('mongoose');

const {
  consultationDetailsScheme,
  consultationPeriodsScheme,
  lecturerDetailsScheme,
  studentDetailsScheme,
  studentBookingScheme,
} = require('../schemas/tablesSchemas');

// Create models based on the defined schemas
const lecturerDetails = mongoose.model('lecturer_details', lecturerDetailsScheme);
const consultationPeriods = mongoose.model('consultation_periods', consultationPeriodsScheme);
const studentBooking = mongoose.model('student_bookings', studentBookingScheme);
const studentDetails = mongoose.model('student_details', studentDetailsScheme);
const consultationDetails = mongoose.model('consultation_details', consultationDetailsScheme);

// Export the models and the connect function
module.exports = {
  lecturerDetails,
  consultationDetails,
  consultationPeriods,
  studentBooking,
  studentDetails,
};
