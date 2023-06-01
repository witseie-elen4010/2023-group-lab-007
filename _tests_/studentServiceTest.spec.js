const {getStudentByNumber, getBookingsByConsultationId } = require('../src/services/student_service');
const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('../src/services/dbProvider');
const studentDetailsPipeline = require('../src/controllers/studentDetailsPipeline');
const studentConsultationPipeline = require('../src/controllers/studentConsultationPipeline');

describe('get Student By Number', () => {
    test('should return student details for a student', async () => {
        // Mock the necessary dependencies
        const studentNumber = '2351852'
        const studentDetailsData = [{ studentNumber: '2351852', emailAddress: '2351852@students.wits.ac.za', firstName: 'Tshepo', lastName: 'Mokgokong' }]
        studentDetails.find = jest.fn().mockResolvedValue(studentDetailsData)
        // Call the function to test
        const result = await getStudentByNumber(studentNumber)
        // Assertions based on the mocked values
        expect(studentDetails.find).toHaveBeenCalledWith({ studentNumber: studentNumber })
        expect(result).toEqual(studentDetailsData)
    })
    test('should return an empty array for a student number not on the dataset', async () => {
        // Mock the aggregate function
        studentDetails.find = jest.fn().mockResolvedValueOnce([])
        const studentNumberNotInDataset = 'aaaaa'
        const result = await getStudentByNumber(studentNumberNotInDataset)
        // Check that the result is an empty array
        expect(result).toEqual([])
    }
    )
    test('should throw an error if the student details cannot be retrieved', async () => {
        const studentDetailsData = [{ studentNumber: '2351852', emailAddress: '2351852@students.wits.ac.za' }]
        studentDetails.find = jest.fn().mockRejectedValueOnce(new Error('Failed to get student details'))
        // Check that the function throws an error
        await expect(getStudentByNumber(studentDetailsData)).rejects.toThrow('Failed to get student details')
    }
    )
})

describe('get Bookings By Consultation Id', () => {
    test('should return bookings for a consultation id', async () => {
        // Mock the necessary dependencies
        const consultationId = 1
        const studentBookingData = [{ studentNumber: '2351852', consultationId: 1, bookingId: 1 }]
        studentBooking.find = jest.fn().mockResolvedValue(studentBookingData)
        // Call the function to test
        const result = await getBookingsByConsultationId(consultationId)
        // Assertions based on the mocked values
        expect(studentBooking.find).toHaveBeenCalledWith({ consultationId: consultationId })
        expect(result).toEqual(studentBookingData)
    })
    test('should throw error if bookings cannot be retrieved', async () => {
        const consultationId = 1
        studentBooking.find = jest.fn().mockRejectedValueOnce(new Error('Failed to get student Bookings'))
        // Check that the function throws an error
        await expect(getBookingsByConsultationId(consultationId)).rejects.toThrow('Failed to get student Bookings')
    }
    )
})
