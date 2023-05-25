//const { lecturerDetails } = require("../../database");

const daysOfWeek = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
}
const dropdownMenu = document.querySelector('#teacherList')
const slotDropdownMenu = document.querySelector('#slotList')
const bookButton = document.querySelector('#bookButton')
const defaultOption = document.createElement("option")
const userDataInput = document.querySelector('#user-data')
const user = JSON.parse(userDataInput.value)
const calendarBtn = document.querySelector('#calendarBtn')
const calendarDiv = document.querySelector('#calendar')
const lecturerDetails = fillLecturerField()

defaultOption.text = "Select a teacher"
defaultOption.value = ""
dropdownMenu.appendChild(defaultOption)
dropdownMenu.selectedIndex = 0; // Set the default option as selected

bookButton.addEventListener('click', () => {
  const selectedLecturerId = dropdownMenu.value
  const selectedSlot = slotDropdownMenu.value
  lecturerDetails.then(detailsArray => {
    const selectedLecturer = detailsArray.find(detail => detail.lecturerId === selectedLecturerId)
    console.log(`${user.given_name} has booked a consultation with ${selectedLecturer ? selectedLecturer.firstName + ' ' + selectedLecturer.lastName : 'none'} at ${selectedSlot}`)
  });
});
dropdownMenu.addEventListener('change', async (e) => {
  const selectedTeacher = e.target.value
  //const selectedTeacher = lecturerDetails.find(teacher => teacher.email === teacherEmail);

  // Clear out the previous slots
  while (slotDropdownMenu.options.length > 0) {
    slotDropdownMenu.remove(0)
  }

  if (selectedTeacher) {
    // I am assuming that teacher object has an id field that represents the lecturerId
    const slots = await searchConsultations(selectedTeacher)
    console.log(slots[0])

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]
      for (let j = 0; j < 4; j++) {
        const option = document.createElement("option")
        option.text = getDateString(getNextDate(slot.dayOfWeek, j)) + ' ' + slot.startTime + '-' + slot.endTime
        option.value = slot.dayOfWeek
        slotDropdownMenu.add(option)
      }
    }
  }
})
// Initialize the calendar
let calendar = new FullCalendar.Calendar(calendarDiv, {
  initialView: 'dayGridMonth',
  height: 'auto', // or '100%'
  events: [
    {
      title: 'BCH237',
      start: '2023-05-12T10:30:00',
      end: '2023-05-12T11:30:00',
      extendedProps: {
        department: 'BioChemistry'
      },
      description: 'Lecture'
    }
    // more events ...
  ],
  


  //checkButtonStatus();
});

slotDropdownMenu.addEventListener('change', (e) => {
  const slotIndex = e.target.value
  console.log(`Selected slot: ${slotIndex}`)

  // Enable the book button when a slot is selected
  checkButtonStatus()
});
calendar.render()

//if the user presses the "show consultation" button, display the default consulation.
showConsultation.addEventListener('click', () => {
  getConsultations().then(consultations => {
    if (!calendar) {
      calendar = new FullCalendar.Calendar(calendarDiv, {
        initialView: 'dayGridMonth',
        eventRender: function(event, element) {

          // To append if is assessment
          if(event.description != '' && typeof event.description  !== "undefined")
          {  
              element.find(".fc-title").append("<br/><b>"+event.description+"</b>");
          }
      },
      });
      calendar.render();
    }
    calendar.getEvents().forEach((event) => event.remove());
    consultations.forEach(consultation => {
      const { date, startTime, endTime, lecturer, consultationId, studentCount } = consultation;
      const event = {
        title: 'Consult: ' + consultationId + '<br />'+'\nLecturer: ' + lecturer,
        start: `${date}T${startTime}`,
        end: `${date}T${endTime}`,
        description: `Number of students: ${studentCount}`, // Add the description
        extendedProps: {
          studentCount: studentCount, // Add the studentCount as an extended property
          lecturer: lecturer
        }
      };
      calendar.addEvent(event);
    });

    // Enable the popover functionality
    enablePopover();
  });
});

//function for the pop up, when you hover over the consultation entry
function enablePopover() {
  const eventElements = document.querySelectorAll('.fc-day-grid-event > .fc-content');
  console.log(eventElements)
  eventElements.forEach((eventElement) => {
    console.log(eventElement)
    console.log('pi' + eventElement.getAttribute('data-studentCount'))
    const studentCount = eventElement.getAttribute('data-studentCount');

    eventElement.setAttribute('data-bs-toggle', 'popover');
    eventElement.setAttribute('data-bs-placement', 'top');
    eventElement.setAttribute('data-bs-trigger', 'hover');
    eventElement.setAttribute('data-bs-content', `Number of students: ${studentCount}`);
    eventElement.setAttribute('data-bs-html', 'true');
    eventElement.setAttribute('title', 'Consultation Details');
    eventElement.setAttribute('tabindex', '0');

    const popover = new bootstrap.Popover(eventElement);
  });
}


//if the user presses the "hide consultation on calendar" button, hide the consultations displayed on the calendar
if (hideConsultation) {
  console.log('Clicked hide consultation button') //log to the web console
  hideConsultation.addEventListener('click', () => {

    // Remove all existing events from the calendar
    calendar.getEvents().forEach((event) => event.remove())

  })
}

async function fillLecturerField() {
  const lecturerDetails = await getLecturerDetails();
  for (let i = 0; i < Object.keys(lecturerDetails).length; i++) {
    const teacher = lecturerDetails[i]
    const fullName = `${teacher.firstName} ${teacher.lastName}`

    const option = document.createElement("option")
    option.text = fullName
    option.value = teacher.lecturerId

    dropdownMenu.appendChild(option)
  }
  return lecturerDetails
}
//get correct string format from date object
function getDateString(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // getMonth returns a zero-based value (where 0 is January)
  const day = date.getDate()

  const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  //option.text = formattedDate;
  return formattedDate
}

function checkButtonStatus() {
  const teacherSelected = dropdownMenu.value !== ""
  const slotSelected = slotDropdownMenu.value !== ""

  if (teacherSelected && slotSelected) {
    bookButton.removeAttribute('disabled')
  } else {
    bookButton.setAttribute('disabled', 'true')
  }
}
//function to return the dates of the next 4 coming {dayoftheweek}
function getNextDate(day, j) {
  const today = new Date()
  const targetDay = daysOfWeek[day]
  if (targetDay !== undefined) {
    const daysUntilNextTargetDay = (targetDay - today.getDay() + 7) % 7
    today.setDate(today.getDate() + ((j * 7) + daysUntilNextTargetDay))
    return today;
  } else {
    throw new Error(`Invalid day name: ${dayName}`)
  }
}

//fetch the consultations object stored in lecturerConsultation.js
function getConsultations() {
  return fetch('/class/api/studentConsultationDetails')
    .then(response => response.json())
    .then(data => {
      const consultations = data.map(item => {
        const studentCountTemp = item.student_booking.length - 1;
        return {
          lecturer: item.lecturerId,
          consultationId: item.consultationId,
          date: item.date,
          startTime: item.startTime,
          endTime: item.endTime,
          studentCount: studentCountTemp
        }
      })
      return consultations
    })
    .catch(error => console.error(error))
}

//call the api to get the consultation periods for a specific lecturer
function searchConsultations(Id) {
  const url = `class/api/consultationPeriodsSearch?lecturerId=${Id}`
  // Make an AJAX request to the server to fetch consultation periods
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error("Error fetching consultation periods:", error)
    });
}

// call the api to get the lecturer details from the database
function getLecturerDetails() {
  const url = 'class/api/lecturerDetails'
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Error fetching lecturer details:', error))
}
