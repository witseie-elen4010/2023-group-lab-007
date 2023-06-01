const { getPossibleSlots, getNextDate, getDateString } = require('../public/scripts/services/student_service')

describe('Check for available time slot that does not conflict with other bookings, with the desired duration', () => {

    let bookedSlots = []
    let preConsultation = ['11:00', '11:15'] //start time and end time. 
    bookedSlots.push(preConsultation)
    let duration = 30
    let startTime = '11:00'
    let endTime = '12:00'
    //Check that the function is able to return multiple potential slots when they exist. 
    test('Check that all possible slots are generated', () => {
        expect(getPossibleSlots(startTime, endTime, bookedSlots, duration)).toEqual([ [ '11:15', '11:45' ], [ '11:30', '12:00' ] ])
    })

    //Check that they function is checking that there is no overlap for all the previous bookings. 
    test('Check that all existing bookings are being accounted for', () => {
    bookedSlots.push(['11:45', '12:00']) 
    expect(getPossibleSlots(startTime, endTime, bookedSlots, duration)).toEqual([ [ '11:15', '11:45' ] ])
    })

    //Check that the timeslots are changing based on the duration changing.
    test('Check that changing the duration is working', () => {
        duration = 15
        expect(getPossibleSlots(startTime, endTime, bookedSlots, duration)).toEqual([ [ '11:15', '11:30' ], [ '11:30', '11:45' ]])
    })

    //Check that no consultations are returned when there should not be any potential slots. 
    test('Check when there are no possible consultations available', () => {
        duration = 45
        expect(getPossibleSlots(startTime, endTime, bookedSlots, duration)).toEqual([ ])
    })

})
describe('getNextDate', () => {
    // Define days of the week
    const daysOfWeek = {
      "Sunday": 0,
      "Monday": 1,
      "Tuesday": 2,
      "Wednesday": 3,
      "Thursday": 4,
      "Friday": 5,
      "Saturday": 6,
    }
    
    //Check that the function is returning the correct next date on a specific day of the week. 
    test('returns the next date for a valid day and j value', () => {
        const day = 'Monday'
        const j = 0
    
        // Test date
        const testDate = new Date(2023, 0, 1) // January 1, 2023 (a Sunday)
    
        // Expected result
        const expectedDate = new Date(testDate.getTime()) // clone the test date
        expectedDate.setDate(testDate.getDate() + ((j * 7) + daysOfWeek[day] - testDate.getDay() + 7) % 7)
    
        // Call the function, passing the test date as an argument
        const result = getNextDate(day, j, daysOfWeek, testDate)
    
        // Compare the dates (toISOString() is used to compare the date portion only, not the time)
        expect(result.toISOString().slice(0,10)).toEqual(expectedDate.toISOString().slice(0,10))
    })
    
    //Check to see if the function is able to handle errors/invalid inputs. 
    test('throws an error for an invalid day', () => {
      const day = 'InvalidDay'
      const j = 1
  
      // Test date
      const testDate = new Date(2023, 0, 1) // January 1, 2023 (a Sunday)
  
      // Call the function with invalid input
      expect(() => getNextDate(day, j, daysOfWeek, testDate)).toThrow(`Invalid day name: ${day}`)
    })
  })
  


describe('Testing whether the date formatting is functioning as expected', () => {
    //Check whether the function is correctly formatting the date into the desired string format.
  test('returns correctly formatted date string for a valid date', () => {
    // Construct a date object
    const date = new Date(2023, 5, 1) // June 1, 2023

    // Expected result
    const expectedDateString = '2023-06-01'

    // Call the function
    const result = getDateString(date)

    // Check the result
    expect(result).toEqual(expectedDateString)
  })
  //Check that the function correctly pads the string to match convention. 
  test('returns correctly formatted date string with padded zeros for day and month', () => {
    // Construct a date object
    const date = new Date(2023, 0, 1) // January 1, 2023

    // Expected result
    const expectedDateString = '2023-01-01'

    // Call the function
    const result = getDateString(date)

    // Check the result
    expect(result).toEqual(expectedDateString)
  })
})
