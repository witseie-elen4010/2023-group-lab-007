const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('../src/services/dbProvider');
const {getConsultationPeriods, getLecturerDetails} = require('../src/services/lecturer_service');

describe('getConsultationPeriods', () => {
    test('should return consultationPeriods for a lecturer', async () => {
        //Mock the necessary dependencies
        const selectedLecturerId = 12346
        const consultationPeriodsData = [{ lecturerId: 12346, consultationId: 1, startTime: '10:00', endTime: '11:00' }]
        consultationPeriods.find = jest.fn().mockResolvedValue(consultationPeriodsData)
        //Call the function to test
        const result = await getConsultationPeriods(selectedLecturerId)
        //Assertions based on the mocked values
        expect(consultationPeriods.find).toHaveBeenCalledWith({ lecturerId: selectedLecturerId })
        expect(result).toEqual(consultationPeriodsData)
    })
    test('should throw error if consultationPeriods cannot be retrieved', async () => {
        const selectedLecturerId = 12346
        consultationPeriods.find = jest.fn().mockRejectedValueOnce(new Error('Failed to get consultationPeriods'))
        //Check that the function throws an error
        await expect(getConsultationPeriods(selectedLecturerId)).rejects.toThrow('Failed to get consultationPeriods')
    })
})

describe('getLecturerDetails', () => {
    test('should return lecturer details', async () => {
        //Mock the necessary dependencies
        const lecturerDetailsData = [{ lecturerId: 12346, firstName: 'Tshepo', lastName: 'Mokgokong' }]
        lecturerDetails.find = jest.fn().mockResolvedValue(lecturerDetailsData)
        //Call the function to test
        const result = await getLecturerDetails()
        //Assertions based on the mocked values
        expect(lecturerDetails.find).toHaveBeenCalled()
        expect(result).toEqual(lecturerDetailsData)
    })
    test('should throw error if lecturer details cannot be retrieved', async () => {
        lecturerDetails.find = jest.fn().mockRejectedValueOnce(new Error('Failed to get lecturer details'))
        //Check that the function throws an error
        await expect(getLecturerDetails()).rejects.toThrow('Failed to get lecturer details')
    }
    )
})

