// Pipeline that looks for stuff across multiple collections
const examplePipeline = [
  {
    $lookup: {
      from: 'student_bookings',
      localField: 'consultationId',
      foreignField: 'consultationId',
      as: 'student_booking',
      pipeline: [
        {
          $lookup: {
            from: 'student_details',
            localField: 'studentNumber',
            foreignField: 'studentNumber',
            as: 'student_details',
          },
        },
      ],
    },
  },
  {
    $lookup: {
      from: 'lecturer_details',
      localField: 'lecturerId',
      foreignField: 'lecturerId',
      as: 'lecturer_details',
      pipeline: [
        {
          $lookup: {
            from: 'consultation_period',
            localField: 'lecturerId',
            foreignField: 'lecturerId',
            as: 'consultation_period',
          },
        },
      ],
    },
  },
];

module.exports = examplePipeline;