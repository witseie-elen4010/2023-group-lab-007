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
  connect() {
    return new Promise((resolve, reject) => {
      mongoose.connect('mongodb+srv://2305164:VZ2jrn9qYUe048tx@cluster.8cexuwk.mongodb.net/StudentConsultationDB', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });

      mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB!');
        resolve(); // Resolve the promise when connected to MongoDB
      });

      mongoose.connection.on('error', (error) => {
        console.error('Failed to connect to MongoDB:', error);
        reject(error); // Reject the promise if there's an error connecting to MongoDB
      });
    });
  },
  lecturerDetails,
  consultationDetails,
  consultationPeriods,
  studentBooking,
  studentDetails,
};
