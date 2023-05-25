
//Checking the function getStudentConsultationDetails, we will mock the aggregate response from the datset to allow for testing
const { getStudentConsultationDetails } = require('../../src/services/student_consulation_service');
const { consultationDetails } = require('../../src/services/dbProvider');

describe('Student Consultation Service', () => {
  test('should return consultation details for a known Student Number', async () => {
      // Mock the aggregate function, it should return consultations which include the studentNumber
      consultationDetails.aggregate = jest.fn().mockResolvedValueOnce([
        {
          consultationId: 1,
          maximumNumberOfStudents: 5,
          student_booking: [
            {
              _id: "646e2df8b9d3bbda9ef801b9",
              consultationId: 1,
              studentNumber: '2305164',
              role: "Member",
            },
          ]
        },
      ]);
    const studentNumber = '2305164'
    // Call the function to be tested
    const result = await getStudentConsultationDetails(studentNumber)
     // Log the result
    console.log(result);
    expect(typeof result).toEqual('object');
    expect(result[0].student_booking[0].studentNumber).toEqual(studentNumber);
  })
  test('should return an empty array for a student number not on the dataset', async () => {
    // Mock the aggregate function
    consultationDetails.aggregate = jest.fn().mockResolvedValueOnce([]);
    const studentNumberNotInDataset = 'aaaaa';
    const result = await getStudentConsultationDetails(studentNumberNotInDataset);
    // Check that the result is an empty array
    console.log(result);
    expect(result).toEqual([]);
  });
});

//Checking the studentConsultationPipeline is exporting as expected
const studentConsultationPipeline = require('../../src/controllers/studentConsultationPipeline');

describe('Student Consultation Pipeline', () => {
  test('should generate pipeline for a known Student Number', () => {
    const studentNumber = '2305164';
    const pipeline = studentConsultationPipeline(studentNumber);
    // Assert the pipeline stages
    expect(pipeline).toEqual([
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
    ]);
  });

  test('should generate pipeline for a student number not on the dataset', () => {
    const studentNumberNotInDataset = 'aaaaa';
    const pipeline = studentConsultationPipeline(studentNumberNotInDataset);
    // Assert the pipeline stages
    expect(pipeline).toEqual([
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
          "student_booking.studentNumber": studentNumberNotInDataset
        }
      }
    ]);
  });
});


