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
const testStudent = "2305164"
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

  // Enable the book button when a slot is selected
  checkButtonStatus()
})
calendar.render()

//if the user presses the "show consultation" button, display the default consulation.
if (showConsultation) {
  console.log('Clicked show consultation button')
  showConsultation.addEventListener('click', () => {
    getConsultations().then(consultations => {
      console.log("[Unknown User] clicked show consultation button")
      if (!calendar) {
        calendar = new FullCalendar.Calendar(calendarDiv, {
          initialView: 'dayGridMonth',
        })
        calendar.render()
      }
      // Remove all existing events from the calendar
      calendar.getEvents().forEach((event) => event.remove())
      // Add all the consultations to the calendar
      consultations.forEach(event => {
        calendar.addEvent(event)
      })
    })
  })
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
  return fetch('/class/api/studentConsultations')
    .then(response => response.json())
    .then(data => {
      const consultations = data.map(item => ({ title: item.lecturer, date: item.date, }))
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


function generateConsultationsHTML(lecturer, consultations) {
  let html = `<h5>${lecturer}</h5>`;
  const approvedConsultations = consultations.filter(consultation => consultation.status === "approved");
  if (approvedConsultations.length === 0) {
    html += '<p>No approved consultations scheduled</p>';
  } else {
    html += '<ul>';
    approvedConsultations.forEach(consultation => {
      html += '<li>';
      html += `Date: ${consultation.date}<br>`; // Display the consultation date
      html += `Time: ${consultation.startTime} - ${consultation.endTime}<br>`; // Display the consultation time range
      html += `Maximum number of students: ${consultation.maximumNumberOfStudents}<br>`; // Display the maximum number of students
      html += `Status: ${consultation.status}<br>`; // Display the consultation status
      html += '<button class="joinButton">Join</button>'; // Add a button to join the consultation
      html += '</li>';
    });
    html += '</ul>';
  }
  return html;
}


function handleConsultationsToggle() {
  const lecturerInput = document.getElementById('lecturerInput');
  const lecturerName = lecturerInput.value.trim().toLowerCase();

  if (lecturerName === '') {
    // Display an error message if no lecturer name is entered
    displayErrorMessage('Please enter a lecturer name');
  } else {
    // Display a loading indicator while fetching data
    displayLoadingIndicator();

    // Fetch lecturer details
    getLecturerDetails()
      .then(lecturerInfo => {
        // Find matching lecturers based on the entered name
        const matchingLecturers = findMatchingLecturers(lecturerInfo, lecturerName);

        if (matchingLecturers.length > 0) {
          const lecturerId = matchingLecturers[0].lecturerId;

          // Search consultations for the specified lecturer
          searchConsultationsPerLecturer(lecturerId)
            .then(consultations => {
              if (consultations.length > 0) {
                // Generate HTML for the consultations
                const lecturerFullName = `${matchingLecturers[0].firstName} ${matchingLecturers[0].lastName}`;
                const consultationsHTML = generateConsultationsHTML(lecturerFullName, consultations);
                // Display the consultations HTML
                displayConsultations(consultationsHTML);
                // Update the button text and event handler for hiding consultations
                updateButton('Refresh', handleHideConsultations);
              } else {
                // Display an error message if no consultations found for the lecturer
                displayErrorMessage('No consultations found for the specified lecturer');
              }
            })
            .catch(error => displayErrorMessage('Error searching consultations'));
        } else {
          // Display an error message if no lecturer found with the specified name
          displayErrorMessage('No lecturer found with the specified name');
        }
      })
      .catch(error => displayErrorMessage('Error fetching lecturer details'));
  }
}

function handleHideConsultations() {
  // Clear the consultations container
  clearConsultationsContainer();
  // Update the button text to 'View Consultations' and set the event handler to handleConsultationsToggle
  updateButton('View Consultations', handleConsultationsToggle);
}

function handleLecturerInput() {
  const lecturerInput = document.getElementById('lecturerInput');
  const isInputEmpty = lecturerInput.value.trim() === '';

  if (isInputEmpty && isButtonHidden()) {
    // If the input is empty and the button is hidden, update the button text to 'View Consultations' and set the event handler to handleConsultationsToggle
    updateButton('View Consultations', handleConsultationsToggle);
  } else if (isButtonHidden()) {
    // If the button is hidden, update the button text to 'View Consultations' and set the event handlers to handleViewConsultationsClick and handleHideConsultations
    updateButton('View Consultations');
    updateButtonEvent(handleViewConsultationsClick, handleHideConsultations);
  }
}


function handleViewConsultationsClick() {
  const lecturerInput = document.getElementById('lecturerInput');
  const lecturerName = lecturerInput.value.trim().toLowerCase();

  if (lecturerName === '') {
    // Display an error message if no lecturer name is entered
    displayErrorMessage('Please enter a lecturer name');
  } else {
    // Display a loading indicator while fetching data
    displayLoadingIndicator();

    // Fetch lecturer details
    getLecturerDetails()
      .then(lecturerInfo => {
        // Find matching lecturers based on the entered name
        const matchingLecturers = findMatchingLecturers(lecturerInfo, lecturerName);

        if (matchingLecturers.length > 0) {
          const lecturerId = matchingLecturers[0].lecturerId;

          // Search consultations for the specified lecturer
          searchConsultationsPerLecturer(lecturerId)
            .then(consultations => {
              if (consultations.length > 0) {
                // Generate HTML for the consultations
                const lecturerFullName = `${matchingLecturers[0].firstName} ${matchingLecturers[0].lastName}`;
                const consultationsHTML = generateConsultationsHTML(lecturerFullName, consultations);
                // Display the consultations HTML
                displayConsultations(consultationsHTML);
                // Update the button text and event handler for hiding consultations
                updateButton('Refresh', handleHideConsultations);
              } else {
                // Display an error message if no consultations found for the lecturer
                displayErrorMessage('No consultations found for the specified lecturer');
              }
            })
            .catch(error => displayErrorMessage('Error searching consultations'));
        } else {
          // Display an error message if no lecturer found with the specified name
          displayErrorMessage('No lecturer found with the specified name');
        }
      })
      .catch(error => displayErrorMessage('Error fetching lecturer details'));
  }
}


function findMatchingLecturers(lecturerInfo, lecturerName) {
  // Filter the lecturerInfo array to find matching lecturers based on the entered name
  return lecturerInfo.filter(lecturer => {
    const fullName = `${lecturer.firstName.toLowerCase()} ${lecturer.lastName.toLowerCase()}`;
    return fullName.includes(lecturerName);
  });
}

function displayLoadingIndicator() {
  // Display a loading indicator inside the consultations container
  consultationsContainer.innerHTML = '<p>Loading...</p>';
}

function displayErrorMessage(message) {
  // Display an error message inside the consultations container
  consultationsContainer.innerHTML = `<p>${message}</p>`;
}

function displayConsultations(consultationsHTML) {
  // Display the generated consultations HTML inside the consultations container
  consultationsContainer.innerHTML = consultationsHTML;
}

function clearConsultationsContainer() {
  // Clear the consultations container by emptying its content
  consultationsContainer.innerHTML = '';
}

function updateButton(text, clickHandler) {
  // Update the text and event handler of the viewConsultationsBtn
  viewConsultationsBtn.innerText = text;
  updateButtonEvent(clickHandler);
}

function updateButtonEvent(clickHandler, removeHandler) {
  // Update the event handler of the viewConsultationsBtn, removing the previous handler if provided
  viewConsultationsBtn.removeEventListener('click', removeHandler);
  viewConsultationsBtn.addEventListener('click', clickHandler);
}

function isButtonHidden() {
  // Check if the viewConsultationsBtn is in a hidden state (text is 'Refresh')
  return viewConsultationsBtn.innerText === 'Refresh';
}

const consultationsContainer = document.getElementById('consultations');
const viewConsultationsBtn = document.getElementById('viewConsultationsBtn');
const initialBtnText = viewConsultationsBtn.innerText;

const lecturerInput = document.getElementById('lecturerInput');
lecturerInput.addEventListener('input', handleLecturerInput);

viewConsultationsBtn.addEventListener('click', handleViewConsultationsClick);


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

  if (selectedTeacher) {
    // Fetch consultation periods for selected lecturer

    // Fetch existing consultations for selected lecturer
    const existingConsultations = await getExistingConsultations(selectedTeacher)
    
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
      });
      console.log(numberOfStudents)
      if(numberOfStudents>=consultation.maximumNumberOfStudents){
        continue
      }
      const option = document.createElement("option")
      option.text = `${consultation.date} at ${consultation.startTime}-${consultation.endTime}`
      option.value = consultation.consultationId
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
    slotDropdownMenu.setAttribute('disabled', true)
    slotDropdownMenu.selectedIndex = 0
    bookButton.textContent = "Join"
    joinExisting = true
  } else { //change the button from "Join" to "Book".
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
      console.error("Error fetching consultation details:", error)
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
