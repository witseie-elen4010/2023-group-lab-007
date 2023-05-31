//Checking the function getStudentConsultationDetails, we will mock the aggregate response from the datset to allow for testing
const { getStudentConsultationDetails } = require('../src/services/student_consulation_service');
const { consultationDetails } = require('../src/services/dbProvider');
const request = require('supertest');
// const app = require('../index.js');

// describe('GET /api/testPipeline', () => {
//     it('should return 200 ', async () => {
//         const response = await request(app).get('/class/api/testPipeline');
//         expect(response.status).toBe(200) // Assert that we get a 200 OK status code
//         const data = response.body
//         expect(data).toBeInstanceOf(Array) // Assert that data is an array

//         // Check if the first object in the array has the expected fields
//         const firstItem = data[0]
//         expect(firstItem).toHaveProperty('_id')
//         expect(firstItem).toHaveProperty('consultationId')
//         expect(firstItem).toHaveProperty('lecturerId')

//     }
//     )
//     it('should return 404 if an error occurs', async () => {
//         const response = await request(app).get('/class/api/testPipelin')
//         expect(response.status).toBe(404)
//         expect(response.body).toEqual({})
//     })
// })

// const { createRequest, createResponse } = require('node-mocks-http');
// const apiRouter = require('../src/routes/apiRoutes'); // Import our routes
// const { getStudentConsultationDetails, getStudentDetails } = require('../src/services/student_consulation_service.js'); // Import our service funciton
// jest.mock('../src/services/student_consulation_service.js');

// describe('GET /api/userStudentNumber', () => {
//   it('should return 200 OK', async () => {
//     const userEmail = '2351852@students.wits.ac.za'

//     const req = createRequest({ // Create a mock request object, including oauth0 oicd user object
//       method: 'GET',
//       url: '/api/userStudentNumber',
//       oidc: {
//         user: {
//           email: userEmail,
//         },
//       },
//     })

//     const res = createResponse()
//     // Mock the getStudentDetails function to return a predefined student number
//     getStudentDetails.mockResolvedValue([{ "_id": "646f7b0f0c9daeadf95f7c70", "studentNumber": "2351852", "emailAddress": "john@students.wits.ac.za", "firstName": "John", "lastName": "Sparrow" }])

//     apiRouter(req, res);// Use the router function from apiRoutes.js
//     expect(res.statusCode).toBe(200) // Assert that we get a 200 OK status code
//   })
//   it('should return 400 for invalid student email', async () => {
//     const userEmail = '2351852@student'

//     const req = createRequest({
//       method: 'GET',
//       url: '/api/userStudentNumber',
//       oidc: {
//         user: {
//           email: userEmail,
//         },
//       },
//     });

//     const res = createResponse()
//     apiRouter(req, res) // Use the router function from apiRoutes.js
//     expect(res.statusCode).toBe(400) // Assert that we get a 400 error as email is not correct

//   })

// })
// describe('GET /api/studentDetails', () => {
//   it('should return 200 OK ', async () => {
//     const userEmail = '2351852@students.wits.ac.za'

//     const req = createRequest({
//       method: 'GET',
//       url: '/api/studentDetails',
//       oidc: {
//         user: {
//           email: userEmail,
//         },
//       },
//     })

//     const res = createResponse();

//     await apiRouter(req, res); // Use the router function from apiRoutes.js
//     expect(res.statusCode).toBe(200);
//     expect(JSON.parse(res._getData())).toEqual([{ "_id": "646f7b0f0c9daeadf95f7c70", "studentNumber": "2351852", "emailAddress": "john@students.wits.ac.za", "firstName": "John", "lastName": "Sparrow" }]);
//   })
// })

// describe('Student Consultation Service', () => {
//   test('should return consultation details for a known Student Number', async () => {
//       // Mock the aggregate function, it should return consultations which include the studentNumber
//       consultationDetails.aggregate = jest.fn().mockResolvedValueOnce([
//         {
//           consultationId: 1,
//           maximumNumberOfStudents: 5,
//           student_booking: [
//             {
//               _id: "646e2df8b9d3bbda9ef801b9",
//               consultationId: 1,
//               studentNumber: '2305164',
//               role: "Member",
//             },
//           ]
//         },
//       ]);
//     const studentNumber = '2305164'
//     // Call the function to be tested
//     const result = await getStudentConsultationDetails(studentNumber)
//     expect(typeof result).toEqual('object');
//     expect(result[0].student_booking[0].studentNumber).toEqual(studentNumber);
//   }, 1000)
//   test('should return an empty array for a student number not on the dataset', async () => {
//     // Mock the aggregate function
//     consultationDetails.aggregate = jest.fn().mockResolvedValueOnce([]);
//     const studentNumberNotInDataset = 'aaaaa';
//     const result = await getStudentConsultationDetails(studentNumberNotInDataset);
//     // Check that the result is an empty array
//     expect(result).toEqual([]);
//   });
// });

//Checking the studentConsultationPipeline is exporting as expected
const studentConsultationPipeline = require('../src/controllers/studentConsultationPipeline');

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