//Display existing consultation settings as a list
function checkForOverlap(dayOfWeek, startTime, endTime, entries) {
  if (startTime >= endTime) {
    return true
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    if (entry.dayOfWeek === dayOfWeek) {
      if (startTime < convertToMinutes(entry.endTime)) {
        if (endTime > convertToMinutes(entry.startTime)) {
          return true
        }
      }
      else {
      }
      return true //Ensures that only one consultation period per day can be specified
    }
    else {
    }
  }
  return false
}

//convert to minutes for easy comparison
function convertToMinutes(timeString) {
  const [time, period] = timeString.split(' ')
  const [hourString, minuteString] = time.split(':')
  let hour = parseInt(hourString, 10)
  const minutes = parseInt(minuteString, 10)

  return (minutes + hour * 60)
}

//convert to minutes for easy comparison
function convertTo24(timeString) {
  const [time, period] = timeString.split(' ')
  const [hourString, minuteString] = time.split(':')
  let hour = parseInt(hourString, 10)
  const minutes = minuteString

  // Convert the hour to 24-hour format if necessary
  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  const sHour = hour.toString();
  const combined = (sHour + ":" + minutes)

  return (combined)
}

module.exports = { checkForOverlap, convertToMinutes, convertTo24 }

