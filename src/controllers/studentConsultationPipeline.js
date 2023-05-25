// consultationPipeline.js
// Pipeline for student consultation
const studentConsultationPipeline = (studentNumber) => {
    return [
        // Existing pipeline stages...
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
          $match: {
            "student_booking.studentNumber": studentNumber
          }
        }
      ];
    };
  
  
  module.exports = studentConsultationPipeline;
  