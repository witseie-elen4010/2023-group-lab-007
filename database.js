const mongoose = require('mongoose')

// Define the schemas for different collections
const consultationDetailsScheme = {
  consultationId: Number,
  lecturerId: Number,
  date: String,
  timeMinutes: String,
  maximumNumberOfStudents: String,
  status: String,
  startTime: String,
  endTime: String
}

const consultationPeriodsScheme = {
  lecturerId: Number,
  dayOfWeek: String,
  startTime: String,
  endTime: String,
  durationMinutes: Number,
  maximumNumberOfConsultationsPerDay: Number,
  numberOfStudents: Number
}

const lecturerDetailsScheme = {
  lecturerId: Number,
  emailAddress: String,
  firstName: String,
  lastName: String,
  password: String
}

const studentDetailsScheme = {
  studentNumber: String,
  emailAddress: String,
  firstName: String,
  lastName: String,
  password: String
}

const studentBookingScheme = {
  consultationId: Number,
  studentNumber: String,
  role: String
}

// Create models based on the defined schemas
const lecturerDetails = mongoose.model('lecturer_details', lecturerDetailsScheme)
const consultationPeriods = mongoose.model('consultation_periods', consultationPeriodsScheme)
const studentBooking = mongoose.model('student_booking', studentBookingScheme)
const studentDetails = mongoose.model('student_details', studentDetailsScheme)
const consultationDetails = mongoose.model('consultation_details', consultationDetailsScheme)

// Export the models and the connect function
module.exports = {
  connect () {
    return new Promise((resolve, reject) => {
      mongoose.connect('mongodb+srv://2305164:VZ2jrn9qYUe048tx@cluster.8cexuwk.mongodb.net/StudentConsultationDB', {
        useUnifiedTopology: true,
        useNewUrlParser: true
      })

      mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB!')
        resolve() // Resolve the promise when connected to MongoDB
      })

      mongoose.connection.on('error', (error) => {
        console.error('Failed to connect to MongoDB:', error)
        reject(error) // Reject the promise if there's an error connecting to MongoDB
      })
    }).then(() => {
      const pipeline = [
        {
          $lookup: {
            from: 'student_booking',
            localField: 'consultationId',
            foreignField: 'consultationId',
            as: 'studentBooking',
            pipeline: [
              {
                $lookup: {
                  from: 'student_details',
                  localField: 'studentNumber',
                  foreignField: 'studentNumber',
                  as: 'studentDetails'
                }
              }
            ]
          }
        },
        {
          $lookup: {
            from: 'lecturer_details',
            localField: 'lecturerId',
            foreignField: 'lecturerId',
            as: 'lecturerDetails',
            pipeline: [
              {
                $lookup: {
                  from: 'consultation_period',
                  localField: 'lecturerId',
                  foreignField: 'lecturerId',
                  as: 'consultationPeriod'
                }
              }
            ]
          }
        }
      ]

      return consultationDetails.aggregate(pipeline).catch((error) => {
        console.error(error)
      })
    })
  },
  lecturerDetails,
  consultationDetails,
  consultationPeriods,
  studentBooking,
  studentDetails
}
