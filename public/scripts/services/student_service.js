
function getPossibleSlots(totalStart, totalEnd, bookedSlots, duration) {
    // Create date object and set time
    const setDateTime = (time) => {
        let [hour, minute] = time.split(':')
        let date = new Date()
        date.setHours(hour, minute, 0, 0)
        return date
    }
  
    // Function to check overlap
    const isOverlap = (start1, end1, start2, end2) => {
        if (start1 >= start2 && start1 < end2) return true;
        if (start2 >= start1 && start2 < end1) return true;
        return false;
    }
  
    // Function to add minutes to a date object
    const addMinutes = (date, minutes) => {
        return new Date(date.getTime() + minutes*60000)
    }
  
    // Function to format date object to time string
    const formatTime = (date) => {
        let hours = date.getHours().toString().padStart(2, '0')
        let minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    }
  
    // Convert total period strings to date objects
    let totalStartObj = setDateTime(totalStart)
    let totalEndObj = setDateTime(totalEnd)
  
    // Create an array to hold the possible slots
    let possibleSlots = []
  
    // Iterate over the total period, advancing by the duration each time
    for (let start = totalStartObj; start < totalEndObj; start = addMinutes(start, 15)) {
        let end = addMinutes(start, duration)
  
        if (end > totalEndObj) break
  
        let overlap = bookedSlots.some(booked => {
            let bookedStart = setDateTime(booked[0])
            let bookedEnd = setDateTime(booked[1])
            return isOverlap(start, end, bookedStart, bookedEnd)
        });
  
        if (!overlap) {
            possibleSlots.push([formatTime(start), formatTime(end)])
        }
    }
  
    return possibleSlots
}

module.exports = {getPossibleSlots}
  