const { getStudentConsultationDetails, getStudentDetails } = require('../src/services/student_consulation_service');
const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('../src/services/dbProvider');
const studentDetailsPipeline = require('../src/controllers/studentDetailsPipeline');
const studentConsultationPipeline = require('../src/controllers/studentConsultationPipeline');

jest.mock('../src/controllers/studentConsultationPipeline');
describe('getStudentConsultationDetails', () => {
    test('should return consultation details for a student', async () => {
        // Mock the necessary dependencies
        const email = '2351852@wits.ac.za'
        const studentNumber = '2351852'
        const studentDetailsData = [{ studentNumber: '2351852', emailAddress: '2351852@students.wits.acz.a', firstName: 'Tshepo', lastName: 'Mokgokong' }];
        const consultationDetailsStudentData = [{ consultationId: 1, date: "2023-05-01", timeMinutes: 15  }]
    
        studentDetails.aggregate = jest.fn().mockResolvedValue(studentDetailsData)
        consultationDetails.aggregate = jest.fn().mockResolvedValue(consultationDetailsStudentData)
    
        // Call the function to test
        const result = await getStudentConsultationDetails(email)
    
        // Assertions based on the mocked values
        expect(studentDetails.aggregate).toHaveBeenCalledWith(studentDetailsPipeline(email))
        expect(consultationDetails.aggregate).toHaveBeenCalledWith(studentConsultationPipeline(studentNumber))
        expect(result).toEqual(consultationDetailsStudentData)
    })

    test('should return an empty array for a student number not on the dataset', async () => {
        // Mock the aggregate function
        consultationDetails.aggregate = jest.fn().mockResolvedValueOnce([])
        const studentNumberNotInDataset = 'aaaaa'
        const result = await getStudentConsultationDetails(studentNumberNotInDataset)
        // Check that the result is an empty array
        expect(result).toEqual([])
    }
    )
    test('should throw an error if the student details cannot be retrieved', async () => {
        // Mock the aggregate function
        const email = '2351852@wits.ac.za'
        const consultationDetailsStudentData = [{ consultationId: 1, date: "2023-05-01", timeMinutes: 15  }]
        studentDetails.aggregate = jest.fn().mockRejectedValueOnce(new Error('Failed to get student details'))
        consultationDetails.aggregate = jest.fn().mockResolvedValue(consultationDetailsStudentData)
        // Check that the function throws an error
        await expect(getStudentConsultationDetails(email)).rejects.toThrow('Failed to get student consultation details')

        }
    )
  })

  describe('getStudentDetails', () => {
    test('should return consultation details for a student', async () => {
        // Mock the necessary dependencies
        const email = '2351852@wits.ac.za'
        const studentNumber = '2351852'
        const studentDetailsData = [{ studentNumber: '2351852', emailAddress: '2351852@students.wits.acz.a', firstName: 'Tshepo', lastName: 'Mokgokong' }];
        
        studentDetails.aggregate = jest.fn().mockResolvedValue(studentDetailsData)
        // Call the function to test
        const result = await getStudentDetails(email)
         // Assertions based on the mocked values
        expect(studentDetails.aggregate).toHaveBeenCalledWith(studentDetailsPipeline(email))
         expect(result).toEqual(studentDetailsData)
    })
    test('should throw an error if the student details cannot be retrieved', async () => {
        // Mock the aggregate function
        const email = '2351852@wits.ac.za'
        studentDetails.aggregate = jest.fn().mockRejectedValueOnce(new Error('Failed to get student details'))
        // Check that the function throws an error, with correct error message
        await expect(getStudentDetails(email)).rejects.toThrow('Failed to get student details')

        }
    )
  })

  