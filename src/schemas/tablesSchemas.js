// Define the schemas for different collections
const consultationDetailsScheme = {
  consultationId: Number,               
  lecturerId: String,                   //String
  date: String,
  timeMinutes: String,
  maximumNumberOfStudents: String,
  status: String,
  startTime: String,
  endTime: String,
};

const consultationPeriodsScheme = {
  lecturerId: String,                           //string
  dayOfWeek: String,
  startTime: String,
  endTime: String,
  durationMinutes: Number,
  maximumNumberOfConsultationsPerDay: Number,
  numberOfStudents: Number,
};

const lecturerDetailsScheme = {
  lecturerId: String,                         //string
  emailAddress: String,
  firstName: String,
  lastName: String,
  password: String,                         //remove
};

const studentDetailsScheme = {
  studentNumber: String,
  emailAddress: String,
  firstName: String,
  lastName: String,
  password: String,                       //remove
};

const studentBookingScheme = {
  consultationId: Number,
  studentNumber: String,
  role: String,
};

// Export the variables
module.exports = {
  consultationDetailsScheme,
  consultationPeriodsScheme,
  lecturerDetailsScheme,
  studentDetailsScheme,
  studentBookingScheme,
};
