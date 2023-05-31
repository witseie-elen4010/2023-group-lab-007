const request = require('supertest');
//const app = require('../index.js');

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

const { createRequest, createResponse } = require('node-mocks-http');
const apiRouter = require('../src/routes/apiRoutes'); // Import our routes
const {getStudentConsultationDetails, getStudentDetails} = require('../src/services/student_consulation_service.js'); // Import our service funciton
jest.mock('../src/services/student_consulation_service.js');

describe('GET /api/userStudentNumber', () => {
  it('should return 200 OK', async () => {
    const userEmail = '2351852@students.wits.ac.za'

    const req = createRequest({ // Create a mock request object, including oauth0 oicd user object
      method: 'GET',
      url: '/api/userStudentNumber',
      oidc: {
        user: {
          email: userEmail,
        },
      },
    })

    const res = createResponse()
    // Mock the getStudentDetails function to return a predefined student number
    getStudentDetails.mockResolvedValue([{"_id":"646f7b0f0c9daeadf95f7c70","studentNumber":"2351852","emailAddress":"john@students.wits.ac.za","firstName":"John","lastName":"Sparrow"}])

    apiRouter(req, res);// Use the router function from apiRoutes.js
    expect(res.statusCode).toBe(200) // Assert that we get a 200 OK status code
  })
  it('should return 400 for invalid student email', async () => {
    const userEmail = '2351852@student'

    const req = createRequest({
      method: 'GET',
      url: '/api/userStudentNumber',
      oidc: {
        user: {
          email: userEmail,
        },
      },
    });

    const res = createResponse()
    apiRouter(req, res) // Use the router function from apiRoutes.js
    expect(res.statusCode).toBe(400) // Assert that we get a 400 error as email is not correct

  })

})
describe('GET /api/studentDetails', () => {
    it('should return 200 OK ', async () => {
      const userEmail = '2351852@students.wits.ac.za'
  
      const req = createRequest({
        method: 'GET',
        url: '/api/studentDetails',
        oidc: {
          user: {
            email: userEmail,
          },
        },
      })
  
      const res = createResponse();
  
      await apiRouter(req, res); // Use the router function from apiRoutes.js
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual([{"_id":"646f7b0f0c9daeadf95f7c70","studentNumber":"2351852","emailAddress":"john@students.wits.ac.za","firstName":"John","lastName":"Sparrow"}]);
    })
  })


