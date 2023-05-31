const { getPossibleSlots } = require('../public/scripts/services/student_service');

describe('Check for available time slot that does not conflict with other bookings, with the desired duration', () => {

    let bookedSlots = []
    let preConsultation = ['11:00', '11:15'] //start time and end time. 
    bookedSlots.push(preConsultation)
    let duration = 30
    let startTime = '11:00'
    let endTime = '12:00'

    test('Check that all possible slots are generated', () => {
        expect(getPossibleSlots(startTime, endTime, bookedSlots, duration)).toEqual([ [ '11:15', '11:45' ], [ '11:30', '12:00' ] ])
    });

    test('Check that all existing bookings are being accounted for', () => {
    bookedSlots.push(['11:45', '12:00']) 
    expect(getPossibleSlots(startTime, endTime, bookedSlots, duration)).toEqual([ [ '11:15', '11:45' ] ])
    });

    test('Check that changing the duration is working', () => {
        duration = 15
        expect(getPossibleSlots(startTime, endTime, bookedSlots, duration)).toEqual([ [ '11:15', '11:30' ], [ '11:30', '11:45' ]])
    });

    test('Check when there are no possible consultations available', () => {
        duration = 45
        expect(getPossibleSlots(startTime, endTime, bookedSlots, duration)).toEqual([ ])
    });

});
