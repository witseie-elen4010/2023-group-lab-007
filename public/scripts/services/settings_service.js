//Display existing consultation settings as a list
function checkForOverlap(dayOfWeek, startTime, endTime, entries) {
  if (startTime >= endTime) {                   
    return true;
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.dayOfWeek === dayOfWeek) {
      if (startTime < convertToMinutes(entry.endTime)) {
        if (endTime > convertToMinutes(entry.startTime)) {
          return true;
        }
      }
      else {
      }
    }
    else {
    }
  }
  return false;
}

//convert to minutes for easy comparison
function convertToMinutes(timeString) {
  const [time, period] = timeString.split(' ');
  const [hourString, minuteString] = time.split(':');
  let hour = parseInt(hourString, 10);
  const minutes = parseInt(minuteString, 10);

  // Convert the hour to 24-hour format if necessary
  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  return (minutes + hour * 60)
}

module.exports = { checkForOverlap, convertToMinutes}

