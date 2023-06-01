const request = require('supertest');
const { createRequest, createResponse } = require('node-mocks-http');
const apiRouter = require('../src/routes/apiRoutes');
const {getBookingsByStudentNumber
} = require('../src/services/student_service');
jest.mock('../src/services/student_service');
jest.setTimeout(30000)

describe('GET /api/userStudentBooking', () => {
    jest.setTimeout(30000)
    getBookingsByStudentNumber.mockResolvedValue([
        {
          _id: '646f7b0f0c9daeadf95f7c70',
          consultationId: 2,
          studentNumber: '2305164',
          role: 'Member'
        },
        {
          _id: '646f7b0f0c9daeadf95f7c71',
          consultationId: 3,
          studentNumber: '2305164',
          role: 'Member'
        },
        {
          _id: '646f7b0f0c9daeadf95f7c72',
          consultationId: 4,
          studentNumber: '2305164',
          role: 'Member'
        },
        {
          _id: '646f7b0f0c9daeadf95f7c73',
          consultationId: 5,
          studentNumber: '2305164',
          role: 'Member'
        }
      ])
  it('should return 200 OK', async () => {
    const stuNumber = '2305164'

    const req = createRequest({
      method: 'GET',
      url: '/api/userStudentBooking',
      query: {
        studentNumber: stuNumber
      },
    });

    const res = createResponse()

    await apiRouter(req, res)
    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res._getData())).toEqual([{
        _id: '646f7b0f0c9daeadf95f7c70',
        consultationId: 2,
        studentNumber: '2305164',
        role: 'Member'
      },
      {
        _id: '646f7b0f0c9daeadf95f7c71',
        consultationId: 3,
        studentNumber: '2305164',
        role: 'Member'
      },
      {
        _id: '646f7b0f0c9daeadf95f7c72',
        consultationId: 4,
        studentNumber: '2305164',
        role: 'Member'
      },
      {
        _id: '646f7b0f0c9daeadf95f7c73',
        consultationId: 5,
        studentNumber: '2305164',
        role: 'Member'
      }])
    })
})
