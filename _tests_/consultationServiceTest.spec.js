const { getConsultationDetails, getConsultationDetailsByLecID, getConsultationDetailsByID, approveConsultation, cancelConsultation, getMoreDetails, searchConsultationDetails, getConsultationDetailsByLecturer} = require('../src/services/consultation_service')
const {consultationDetails, consultationPeriods, lecturerDetails, studentBooking, studentDetails} = require('../src/services/dbProvider')
const examplePipeline = require('../src/controllers/examplePipeline')
const { deleteConsultationPeriod, getExistingConsultationPeriods } = require('../src/services/consultation_period_service')

describe('Get Consultation Details', () => {
    test('should return all consultation details', async () => {
        //Mock the necessary dependencies
        const consultationDetailsData = [{ consultationId: 1, lecturerId: 12346, studentId: 12345, date: '2021-10-10', startTime: '10:00', endTime: '11:00', status: 'pending' }]
        consultationDetails.find = jest.fn().mockResolvedValue(consultationDetailsData)
        //Call the function to test
        const result = await getConsultationDetails()
        //Assertions based on the mocked values
        expect(consultationDetails.find).toHaveBeenCalled()
        expect(result).toEqual(consultationDetailsData)
    })
    test('should throw error if consultation details cannot be retrieved', async () => {
        consultationDetails.find = jest.fn().mockRejectedValueOnce(new Error('Failed to get consultation details'))
        //Check that the function throws an error
        await expect(getConsultationDetails()).rejects.toThrow('Failed to get consultation details')
    })
})

describe('Get Consultation Details By Lecturer ID', () => {
    test('should return consultation details for a lecturer', async () => {
        //Mock the necessary dependencies
        const selectedLecturerId = 12346
        const consultationDetailsData = [{ consultationId: 1, lecturerId: 12346, studentId: 12345, date: '2021-10-10', startTime: '10:00', endTime: '11:00', status: 'pending' }]
        consultationDetails.find = jest.fn().mockResolvedValue(consultationDetailsData)
        //Call the function to test
        const result = await getConsultationDetailsByLecID(selectedLecturerId)
        //Assertions based on the mocked values
        expect(consultationDetails.find).toHaveBeenCalledWith({ lecturerId: selectedLecturerId })
        expect(result).toEqual(consultationDetailsData)
    })
    test('should throw error if consultation details cannot be retrieved', async () => {
        const selectedLecturerId = 12346
        consultationDetails.find = jest.fn().mockRejectedValueOnce(new Error('Failed to get consultation details'))
        //Check that the function throws an error
        await expect(getConsultationDetailsByLecID(selectedLecturerId)).rejects.toThrow('Failed to get consultation details')
    })
})

describe('Get Consultation Details By ID', () => {
    test('should return consultation details for a consultation ID', async () => {
        //Mock the necessary dependencies
        const selectedConsultationId = 1
        const consultationDetailsData = [{ consultationId: 1, lecturerId: 12346, studentId: 12345, date: '2021-10-10', startTime: '10:00', endTime: '11:00', status: 'pending' }]
        consultationDetails.find = jest.fn().mockResolvedValue(consultationDetailsData)
        //Call the function to test
        const result = await getConsultationDetailsByID(selectedConsultationId)
        //Assertions based on the mocked values
        expect(consultationDetails.find).toHaveBeenCalledWith({ consultationId: selectedConsultationId })
        expect(result).toEqual(consultationDetailsData)
    })
    test('should throw error if consultation details cannot be retrieved', async () => {
        const selectedConsultationId = 1
        consultationDetails.find = jest.fn().mockRejectedValueOnce(new Error('Failed to get consultation details'))
        //Check that the function throws an error
        await expect(getConsultationDetailsByID(selectedConsultationId)).rejects.toThrow('Failed to get consultation details')
    })
})

describe('Approve Consultation', () => {
    test('should approve a consultation', async () => {
        //Mock the necessary dependencies
        const selectedConsultationId = 1
        consultationDetails.updateOne = jest.fn()
        //Call the function to test
        await approveConsultation(selectedConsultationId)
        //Assertions based on the mocked values
        expect(consultationDetails.updateOne).toHaveBeenCalledWith(
            { consultationId: selectedConsultationId },
            { $set: { status: "approved" } }
        )
    })
    test('should throw error if consultation cannot be approved', async () => {
        const selectedConsultationId = 1
        consultationDetails.updateOne = jest.fn().mockRejectedValueOnce(new Error('Failed to approve consultation'))
        //Check that the function throws an error
        await expect(approveConsultation(selectedConsultationId)).rejects.toThrow('Failed to approve consultation')
    })
})

describe('Cancel Consultation', () => {
    test('should cancel a consultation', async () => {
        //Mock the necessary dependencies
        const selectedConsultationId = 1
        consultationDetails.updateOne = jest.fn()
        //Call the function to test
        await cancelConsultation(selectedConsultationId)
        //Assertions based on the mocked values
        expect(consultationDetails.updateOne).toHaveBeenCalledWith(
            { consultationId: selectedConsultationId },
            { $set: { status: "disapproved" } }
        )
    })
    test('should throw error if consultation cannot be cancelled', async () => {
        const selectedConsultationId = 1
        consultationDetails.updateOne = jest.fn().mockRejectedValueOnce(new Error('Failed to cancel consultation'))
        //Check that the function throws an error
        await expect(cancelConsultation(selectedConsultationId)).rejects.toThrow('Failed to cancel consultation')
    })
})

describe('searchConsultationDetails By Lecturer ', () => {
    test('should return consultation details for a lecturer', async () => {
        //Mock the necessary dependencies
        const selectedLecturerId = 12346
        const consultationDetailsData = [{ consultationId: 1, lecturerId: 12346, studentId: 12345, date: '2021-10-10', startTime: '10:00', endTime: '11:00', status: 'pending' }]
        consultationDetails.find = jest.fn().mockResolvedValue(consultationDetailsData)
        //Call the function to test
        const result = await searchConsultationDetails(selectedLecturerId)
        //Assertions based on the mocked values
        expect(consultationDetails.find).toHaveBeenCalledWith({ lecturerId: selectedLecturerId })
        expect(result).toEqual(consultationDetailsData)
    })
    test('should throw error if consultation details cannot be retrieved', async () => {
        const selectedLecturerId = 12346
        consultationDetails.find = jest.fn().mockRejectedValueOnce(new Error('Failed to get consultation details'))
        //Check that the function throws an error
        await expect(searchConsultationDetails(selectedLecturerId)).rejects.toThrow('Failed to get consultation details')
    })
})

describe('get Consultation Details by Lectuerer ID ', () => {
    test('should return consultation details for a lecturer ID', async () => {
        //Mock the necessary dependencies
        const selectedLecturerId = 12346
        const consultationDetailsData = [{ consultationId: 1, lecturerId: 12346, studentId: 12345, date: '2021-10-10', startTime: '10:00', endTime: '11:00', status: 'pending' }]
        consultationDetails.find = jest.fn().mockResolvedValue(consultationDetailsData)
        //Call the function to test
        const result = await getConsultationDetailsByLecturer(selectedLecturerId)
        //Assertions based on the mocked values
        expect(consultationDetails.find).toHaveBeenCalledWith({ lecturerId: selectedLecturerId })
        expect(result).toEqual(consultationDetailsData)
    })
    test('should throw error if consultation details cannot be retrieved', async () => {
        const selectedLecturerId = 12346
        consultationDetails.find = jest.fn().mockRejectedValueOnce(new Error('Failed to get consultation details'))
        //Check that the function throws an error
        await expect(getConsultationDetailsByLecturer(selectedLecturerId)).rejects.toThrow('Failed to get consultation details')
    })
})

// Testing the consultation_period_service file



describe('Delete Consultation Period for Lecturer', () => {
    test('should delete a consultation period', async () => {
        //Mock the necessary dependencies
        const selectedConsultationPeriodId = 1
        consultationPeriods.deleteOne = jest.fn()
        const lecturerID= 'John'
        const dayOfWeek = 'Monday'
        //Call the function to test
        await deleteConsultationPeriod(lecturerID, dayOfWeek)
        //Assertions based on the mocked values
        expect(consultationPeriods.deleteOne).toHaveBeenCalledWith({ lecturerId: lecturerID, dayOfWeek: dayOfWeek})
    })
    test('should throw error if consultation period cannot be deleted', async () => {
        const selectedLecturerId = 'John'
        consultationPeriods.deleteOne = jest.fn().mockRejectedValueOnce(new Error('Failed to delete consultation period'))
        //Check that the function throws an error
        await expect(deleteConsultationPeriod(selectedLecturerId)).rejects.toThrow('Failed to delete consultation period')
    })
})

describe('Get Existing Consultation Periods for Lecture ID', () => {
    test('should return consultation periods for lecture ID', async () => {
        //Mock the necessary dependencies
        const selectedLecturerId = 'John'
        const consultationPeriodData = [{ consultationPeriodId: 1, lecturerId: 12346, date: '2021-10-10', startTime: '10:00', endTime: '11:00' }]
        consultationPeriods.find = jest.fn().mockResolvedValue(consultationPeriodData)
        //Call the function to test
        const result = await getExistingConsultationPeriods(selectedLecturerId)
        //Assertions based on the mocked values
        expect(consultationPeriods.find).toHaveBeenCalled()
        expect(result).toEqual(consultationPeriodData)
    })
    test('should throw error if consultation periods cannot be retrieved', async () => {
        consultationPeriods.find = jest.fn().mockRejectedValueOnce(new Error('Failed to get consultation periods'))
        //Check that the function throws an error
        await expect(getExistingConsultationPeriods()).rejects.toThrow('Failed to get consultation periods')
    })
})




