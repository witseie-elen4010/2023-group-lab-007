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
const testStudent = "2305164" // Change this and instead always use user (line 18). 
const dropdownMenu = document.querySelector('#teacherList')
const slotDropdownMenu = document.querySelector('#slotList')
const bookButton = document.querySelector('#bookButton')
const defaultOption = document.createElement("option")
const userDataInput = document.querySelector('#user-data')
const user = JSON.parse(userDataInput.value)
const calendarBtn = document.querySelector('#calendarBtn')
const calendarDiv = document.querySelector('#calendar')
const lecturerDetails = fillLecturerField()
let joinExisting = false // Set a boolean variable to track the action

defaultOption.text = "Select a teacher"
defaultOption.value = ""
dropdownMenu.appendChild(defaultOption)
dropdownMenu.selectedIndex = 0 // Set the default option as selected

const existingConsultationsMenu = document.querySelector('#existingConsultations')

const defaultExistingConsultationsOption = document.createElement("option")
defaultExistingConsultationsOption.text = "Select existing consultation"
defaultExistingConsultationsOption.value = ""
existingConsultationsMenu.appendChild(defaultExistingConsultationsOption)
existingConsultationsMenu.selectedIndex = 0 // Set the default option as selected

const defaultConsultationsOption = document.createElement("option")
defaultConsultationsOption.text = "Select Consultation Slot"
defaultConsultationsOption.value = ""
slotDropdownMenu.appendChild(defaultConsultationsOption)
slotDropdownMenu.selectedIndex = 0 // Set the default option as selected

bookButton.addEventListener('click', () => {
  const selectedLecturerId = dropdownMenu.value
  let selectedSlot = ""
  if(!joinExisting){
     selectedSlot = slotDropdownMenu.value
     selectedPeriod = document.getElementById("subperiodDropdown")
     const maxStudents = slotDropdownMenu.options[slotDropdownMenu.selectedIndex].dataset.maxCapacity
     if(!selectedPeriod){
      return
     }
     const slotStart = selectedPeriod.options[selectedPeriod.selectedIndex].dataset.start
     const slotEnd = selectedPeriod.options[selectedPeriod.selectedIndex].dataset.end
     const duration = selectedPeriod.value
     getAllConsultations()
  .then(detailsArray => {
    const consultationIds = detailsArray.map(detail => detail.consultationId)
    const maxConsultationId = Math.max(...consultationIds)
    const consultationId = maxConsultationId+1
    details = {
      consultationId: parseInt(consultationId),
      lecturerId: String(selectedLecturerId),
      date: String(selectedSlot),
      timeMinutes: parseInt(duration),
      maximumNumberOfStudents: parseInt(maxStudents),
      status: String("disapproved"), //set default of disapproved, requires lecturer to accept consultation. 
      startTime: String(slotStart),
      endTime: String(slotEnd),
   }
   console.log(details)
   createConsultation(details)
   .then(data => {
    console.log('Booking created successfully:', data)
    // Perform any additional actions after successful booking
    //Make a function for this whole thing and call it both times.
     bookingDetails = { //create the entry for the student booking. 
      consultationId: consultationId,
      studentNumber: testStudent, //user.studentNumber
      role: "Organizer" //s?
     }
     createBooking(bookingDetails) // create a booking entry for the student for the consultation selected.
  .then(data => {
    console.log('Booking created successfully:', data)
    // Perform any additional actions after successful booking
  })
  .catch(error => {
    console.error('Failed to create booking:', error)
    // Handle the error appropriately
  })
  })
  .catch(error => {
    console.error('Failed to create booking:', error)
    // Handle the error appropriately
  })
  })
  .catch(err => console.error(err)) 

  }
  else{ // if the student has selected an existing consultation, then add them to that consultation.
     selectedSlot = existingConsultationsMenu.value //get the consultationId.
     bookingDetails = { //create the entry for the student booking. 
      consultationId: selectedSlot,
      studentNumber: testStudent, //user.studentNumber
      role: "Member"
     }

     createBooking(bookingDetails) // create a booking entry for the student for the consultation selected.
  .then(data => {
    console.log('Booking created successfully:', data)
    // Perform any additional actions after successful booking
  })
  .catch(error => {
    console.error('Failed to create booking:', error)
    // Handle the error appropriately
  })
  }

  getStudentDetails(testStudent)
      .then(student => {
        console.log(student)
      })

  lecturerDetails.then(detailsArray => {
    const selectedLecturer = detailsArray.find(detail => detail.lecturerId === selectedLecturerId)
    console.log(`${user.given_name} has booked a consultation with ${selectedLecturer ? selectedLecturer.firstName + ' ' + selectedLecturer.lastName : 'none'} at ${selectedSlot}`)
  })
})
dropdownMenu.addEventListener('change', async (e) => {
  const selectedTeacher = e.target.value
  //const selectedTeacher = lecturerDetails.find(teacher => teacher.email === teacherEmail);

  // Clear out the previous slots besides the default unselected option. 
  while (slotDropdownMenu.options.length > 1) {
    slotDropdownMenu.remove(1)
  }
  while (existingConsultationsMenu.options.length > 1) {
    existingConsultationsMenu.remove(1)
  }

  if (selectedTeacher) {
    // I am assuming that teacher object has an id field that represents the lecturerId
    const slots = await searchConsultations(selectedTeacher)
    console.log(slots[0])

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]
      for (let j = 0; j < 4; j++) {
        const option = document.createElement("option")
        option.text = getDateString(getNextDate(slot.dayOfWeek, j)) + ' at ' + slot.startTime + '-' + slot.endTime
        option.value = getDateString(getNextDate(slot.dayOfWeek, j))
        option.dataset.length = slot.durationMinutes
        option.dataset.start = slot.startTime
        option.dataset.maxCapacity = slot.numberOfStudents
        slotDropdownMenu.add(option)
      }
    }
  }
  checkButtonStatus()
})
// Initialize the calendar
let calendar = new FullCalendar.Calendar(calendarDiv, {
  initialView: 'dayGridMonth',
  height: 'auto' // or '100%'

  //checkButtonStatus();
})

slotDropdownMenu.addEventListener('change', (e) => {
  const slotIndex = e.target.value
  console.log(`Selected slot: ${slotIndex}`)
  if (this.value !== "") { //if a slot is selected
    existingConsultationsMenu.setAttribute('disabled', true) // disable existing consultations
    existingConsultationsMenu.selectedIndex = 0 //reset selection to default
    bookButton.textContent = "Book"
    joinExisting = false
  } else { 
    existingConsultationsMenu.removeAttribute('disabled') // enable existing consultations
    bookButton.textContent = "Join"
    joinExisting = true
  }  clearConsultationsContainer()
  // Enable the book button when a slot is selected
  checkButtonStatus()
})
calendar.render()

//if the user presses the "show consultation" button, display the default consulation.
showConsultation.addEventListener('click', () => {
  getConsultations().then(consultations => {
    if (!calendar) {
      calendar = new FullCalendar.Calendar(calendarDiv, {
        initialView: 'dayGridMonth',
      });
      calendar.render();
    }
    
    calendar.getEvents().forEach((event) => event.remove());
    consultations.forEach(consultation => {
      const { date, startTime, endTime, lecturer, consultationId, studentCount } = consultation;
      const event = {
        title: lecturer + `\n Students: ${studentCount}`,
        start: `${date}T${startTime}`,
        end: `${date}T${endTime}`,
        description: `Students: ${studentCount}`, // Add the description
      };
      console.log(consultations)
      console.log('Event'+event)
      calendar.addEvent(event);
    });

  });
});


async function fillLecturerField() {
  const lecturerDetails = await getLecturerDetails()
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
  return formattedDate
}

function checkButtonStatus() {
  const teacherSelected = dropdownMenu.value !== ""
  const slotSelected = slotDropdownMenu.value !== ""
  const existingConsultationSelected = existingConsultationsMenu.value !== ""

  if (teacherSelected && (slotSelected||existingConsultationSelected)) {
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
    return today
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
        const studentCountTemp = item.student_booking.length;
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
    })
}

// call the api to get the lecturer details from the database
function getLecturerDetails() {
  const url = 'class/api/lecturerDetails'
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Error fetching lecturer details:', error))
}

// call the api to get the consultation details of a lecturer from the database
function searchConsultationsPerLecturer(Id) {
  const url = `class/api/consultationPerLecturerSearch?lecturerId=${Id}`
  // Make an AJAX request to the server to fetch consultation periods
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error("Error fetching consultation periods:", error)
    })
}

function generateConsultationsHTML(consultation) {
  let html=''
    html += '<ul>'
      html += '<li>'
      html += `Date: ${consultation.date}<br>` // Display the consultation date
      html += `Time: ${consultation.startTime} - ${consultation.endTime}<br>` // Display the consultation time range
      html += `Maximum number of students: ${consultation.maximumNumberOfStudents}<br>` // Display the maximum number of students
      html += '</li>'
    html += '</ul>'
  
  return html
}

function displayLoadingIndicator() {
  // Display a loading indicator inside the consultations container
  consultationsContainer.innerHTML = '<p>Loading...</p>'
}

function displayConsultations(consultationsHTML) {
  // Display the generated consultations HTML inside the consultations container
  consultationContainer.innerHTML = consultationsHTML
}

function clearConsultationsContainer() {
  // Clear the consultations container by emptying its content
  consultationContainer.innerHTML = ''
}

const consultationContainer = document.getElementById('consultation')

// Selecting the new dropdown menu
dropdownMenu.addEventListener('change', async (e) => {
  const selectedTeacher = e.target.value

  slotDropdownMenu.removeAttribute('disabled')
  bookButton.textContent = "Book"
  joinExisting = false
  // Clear out the previous existing consultations
  while (existingConsultationsMenu.options.length > 1) {
    existingConsultationsMenu.remove(1)
  }
  clearConsultationsContainer()

  if (selectedTeacher) {
    // Fetch consultation periods for selected lecturer

    // Fetch existing consultations for selected lecturer
    const consultations = await getExistingConsultations(selectedTeacher)
    const existingConsultations = consultations.filter(consultation => consultation.status === "approved")

    // Fill the existing consultations dropdown
    let numberOfStudents=0
    for (let i = 0; i < existingConsultations.length; i++) {
      const consultation = existingConsultations[i]
      numberOfStudents = await getBookings(consultation.consultationId)
      .then(data => {
        console.log(data)
        return data.length
        // Perform any additional actions after successful booking
      })
      .catch(error => {
        console.error('Failed to fetch booking:', error)
        // Handle the error appropriately
      })
      console.log(numberOfStudents)
      if(numberOfStudents>=consultation.maximumNumberOfStudents){
        continue
      }
      const option = document.createElement("option")
      option.text = `${consultation.date} `//at ${consultation.startTime}-${consultation.endTime}`
      option.value = consultation.consultationId
      console.log(consultation)
      option.dataset.startTime = consultation.startTime
      option.dataset.endTime = consultation.endTime
      option.dataset.numberOfStudents = consultation.maximumNumberOfStudents
      existingConsultationsMenu.add(option)
    }
  }
})

function getBookings(consultationId){ // get all the bookings for a consultation. 
  const url = `class/api/bookingsByConsultationId?consultationId=${consultationId}`
  return fetch(url)
  .then(response => response.json())
  .catch(error => console.error('Error fetching lecturer details:', error))
}

existingConsultationsMenu.addEventListener('change', function() {
  if (this.value !== "") { //if the user has  selected an existing consultation, change the button from "Book" to "Join"
    details={
      date: existingConsultationsMenu[existingConsultationsMenu.selectedIndex].text,
      startTime : this.options[this.selectedIndex].dataset.startTime,
      endTime : this.options[this.selectedIndex].dataset.endTime,
      maximumNumberOfStudents : existingConsultationsMenu[existingConsultationsMenu.selectedIndex].dataset.numberOfStudents,
    }
    const consultationsHTML = generateConsultationsHTML(details)
    displayConsultations(consultationsHTML)
    slotDropdownMenu.setAttribute('disabled', true)
    slotDropdownMenu.selectedIndex = 0
    bookButton.textContent = "Join"
    joinExisting = true
  } else { //change the button from "Join" to "Book".
    clearConsultationsContainer()
    slotDropdownMenu.removeAttribute('disabled')
    bookButton.textContent = "Book"
    joinExisting = false
  }
  checkButtonStatus()
})


// Function to fetch existing consultations for a specific lecturer
function getExistingConsultations(Id) {
  const url = `class/api/consultationDetailsSearch?lecturerId=${Id}`
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error("Error fetching consultation details:", error)
    })
}
// function to get the student details by their student number. 
function getStudentDetails(studentNumber) {
  const url = `class/api/student?studentNumber=${studentNumber}`
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error("Error fetching student details:", error)
    })
  
}

//function to get a list of all consultations
function getAllConsultations() {
  const url = `class/api/consultationDetailSearch`;
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error("Error fetching consultations:", error);
    })
}
// function to create a booking for the student. 
function createBooking(bookingDetails) {
  return fetch('class/api/studentBooking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingDetails),
  })
  .then(response => {
        if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    // Check if the response is JSON before trying to parse it
    const contentType = response.headers.get("content-type")
    if(contentType && contentType.indexOf("application/json") !== -1) {
      return response.json()
    } else {
      throw new Error('Response not JSON')
    }
  })
  
}

function createConsultation(bookingDetails) {
  return fetch('class/api/consultationDetails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingDetails),
  })
  .then(response => {
        if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    // Check if the response is JSON before trying to parse it
    const contentType = response.headers.get("content-type")
    if(contentType && contentType.indexOf("application/json") !== -1) {
      return response.json()
    } else {
      throw new Error('Response not JSON')
    }
  }) 
}

// Container where the subperiod dropdown will go
const dropdownContainer = document.querySelector('#dropdownContainer')

function getSubPeriod(start, duration, index){ //change when the slots are not a defined length.
    // Create a new Date object
    const date = new Date()

    // Get the hours and minutes from the startTime
    const [hours, minutes] = start.split(':')

    // Set the hours and minutes of the Date object
    date.setHours(hours, minutes, 0, 0) // Set seconds and milliseconds to 0

    // Add the duration to the Date object
    date.setMinutes(date.getMinutes() + duration*index)

    // Extract the hours and minutes from the updated Date object
    let startHours = date.getHours()
    let startMinutes = date.getMinutes()
    startHours = startHours.toString().padStart(2, '0')
    startMinutes = startMinutes.toString().padStart(2, '0')
    // Pad the hours and minutes with leading zeros if necessary
    date.setMinutes(date.getMinutes() + duration)
    // Extract the hours and minutes from the updated Date object
    let endHours = date.getHours()
    let endMinutes = date.getMinutes()
    endHours = endHours.toString().padStart(2, '0')
    endMinutes = endMinutes.toString().padStart(2, '0')

    // Combine the hours and minutes into a string and return it
    const startTime = `${startHours}:${startMinutes}`
    const endTime = `${endHours}:${endMinutes}`
    return [startTime, endTime]
}
// Function to create and add the subperiod dropdown to the DOM
function createSubperiodDropdown(slotLength, startTime) {
  // Calculate the number of subperiods
  removeSubperiodDropdown()
  const numberOfSubperiods = slotLength / 15
  
  // Create the subperiod dropdown
  const subperiodDropdown = document.createElement('select')
  subperiodDropdown.id = 'subperiodDropdown'
  const defaultOption = document.createElement('option')
  defaultOption.text = 'Select a consultation slot'
  defaultOption.value = ''
  subperiodDropdown.add(defaultOption)

  // Populate the dropdown with the subperiods
  for (let i = 0; i < numberOfSubperiods; i++) {
    const option = document.createElement('option')
    let times = getSubPeriod(startTime, 15, i)
    option.text = `${times[0]} - ${times[1]}`
    option.value = 15//change in future.
    option.dataset.start = times[0]
    option.dataset.end = times[1]
    subperiodDropdown.add(option)
  }

  // Add the dropdown to the DOM
  dropdownContainer.appendChild(subperiodDropdown)
}

// Function to remove the subperiod dropdown from the DOM
function removeSubperiodDropdown() {
  const subperiodDropdown = document.querySelector('#subperiodDropdown')
  if (subperiodDropdown) {
    dropdownContainer.removeChild(subperiodDropdown)
  }
}

// Event listener for when a slot is selected
slotDropdownMenu.addEventListener('change', function() {
  if (this.value !== "") { //if a slot is selected
    existingConsultationsMenu.setAttribute('disabled', true) // disable existing consultations
    existingConsultationsMenu.selectedIndex = 0 //reset selection to default
    bookButton.textContent = "Book"
    joinExisting = false

    // Create the subperiod dropdown
    // Create the subperiod dropdown
  const slotLength = this.options[this.selectedIndex].dataset.length
  const startTime = this.options[this.selectedIndex].dataset.start
  createSubperiodDropdown(slotLength, startTime)

  } else { 
    existingConsultationsMenu.removeAttribute('disabled') // enable existing consultations
    bookButton.textContent = "Join"
    joinExisting = true

    // Remove the subperiod dropdown
    removeSubperiodDropdown()
  }
  checkButtonStatus()
})
