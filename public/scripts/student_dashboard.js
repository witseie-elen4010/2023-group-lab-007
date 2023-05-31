//const { lecturerDetails } = require("../../database");

//const { get } = require("mongoose")

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
const messageContainer = document.getElementById("messageContainer")

// Add event listeners to the input fields
dropdownMenu.addEventListener('change', () => {
  // Check if the button is in the "Error" state
  if (bookButton.textContent === 'Error') {
    bookButton.textContent = 'Book'; // Change the button text back to "Book"
    const messageContainer = document.getElementById('messageContainer')
    messageContainer.textContent = ''
  }
})

slotDropdownMenu.addEventListener('change', () => {
  // Check if the button is in the "Error" state
  if (bookButton.textContent === 'Error') {
    bookButton.textContent = 'Book'; // Change the button text back to "Book"
    const messageContainer = document.getElementById('messageContainer')
    messageContainer.textContent = ''
  }
})


bookButton.addEventListener('click', async () => {
  const messageContainer = document.getElementById('messageContainer')
  messageContainer.textContent = ''
  const userStudentNumber = await getUserStudentNumber()
  console.log('studentNumber: ', userStudentNumber)
  console.log('Type of userStudentNumber:', typeof userStudentNumber)
  const selectedLecturerId = dropdownMenu.value
  let selectedSlot = ""

  if (!joinExisting) {
    selectedSlot = slotDropdownMenu.value
    selectedPeriod = document.getElementById("subperiodDropdown")
    const maxStudents = slotDropdownMenu.options[slotDropdownMenu.selectedIndex].dataset.maxCapacity
    if (!selectedPeriod) {
      return;
    }
    const slotStart = selectedPeriod.options[selectedPeriod.selectedIndex].dataset.start
    const slotEnd = selectedPeriod.options[selectedPeriod.selectedIndex].dataset.end
    const duration = document.getElementById("duration").value

    // Change the book button text to "Loading..."
    bookButton.textContent = 'Loading...'

    const verificationStud = await getBookings(userStudentNumber)
    let hasConflict = false

    for (const booking of verificationStud) {
      const consultationId = booking.consultationId
      const consultationDetailsCheck = await getConsultationPerBooking(consultationId)
      const checkDate = consultationDetailsCheck.some(check => {
        return check.date === selectedSlot
      });

      if (checkDate) {
        const overlappingConsultation = consultationDetailsCheck.find(check => {
          return (
            ((check.startTime <= String(slotStart) && check.endTime > String(slotStart)) ||
            (check.startTime >= String(slotStart) && check.endTime < String(slotEnd))) && check.status === 'approved'
          )
        })

        if (overlappingConsultation) {
          const lecturerName = overlappingConsultation.lecturerId.split('@')[0].replace('.', ' ')
          const message = `Already has a consultation booked with ${lecturerName} on ${selectedSlot} at ${overlappingConsultation.startTime} - ${overlappingConsultation.endTime}`
          const messageContainer = document.getElementById('messageContainer')
          messageContainer.textContent = message
          hasConflict = true
          break
        }
      }
    }

    if (hasConflict) {
      // Change the book button text to "Error"
      bookButton.textContent = 'Error'

      // Add event listeners to the input fields
      dropdownMenu.addEventListener('change', () => {
        bookButton.textContent = 'Book'; // Change the button text back to "Book"
        const messageContainer = document.getElementById('messageContainer')
        messageContainer.textContent = ''
      });

      slotDropdownMenu.addEventListener('change', () => {
        bookButton.textContent = 'Book'; // Change the button text back to "Book"
        const messageContainer = document.getElementById('messageContainer')
        messageContainer.textContent = ''
      })

      selectedPeriod.addEventListener('change', () => {
        bookButton.textContent = 'Book'; // Change the button text back to "Book"
        const messageContainer = document.getElementById('messageContainer')
        messageContainer.textContent = ''
      })
      return
    } else{
      // Add event listeners to the input fields
      dropdownMenu.addEventListener('change', () => {
        const messageContainer = document.getElementById('messageContainer')
        messageContainer.textContent = ''
      });

      slotDropdownMenu.addEventListener('change', () => {
        const messageContainer = document.getElementById('messageContainer')
        messageContainer.textContent = ''
      });

      selectedPeriod.addEventListener('change', () => {
        const messageContainer = document.getElementById('messageContainer')
        messageContainer.textContent = ''
      })
    }

    getAllConsultations()
      .then(detailsArray => {
        const consultationIds = detailsArray.map(detail => detail.consultationId)
        const maxConsultationId = Math.max(...consultationIds)
        const consultationId = maxConsultationId + 1
        details = {
          consultationId: parseInt(consultationId),
          lecturerId: String(selectedLecturerId),
          date: String(selectedSlot),
          timeMinutes: parseInt(duration),
          maximumNumberOfStudents: parseInt(maxStudents),
          status: String("approved"),
          startTime: String(slotStart),
          endTime: String(slotEnd),
          title: String("test")
        };
        console.log(details);

        createConsultation(details)
          .then(data => {
            console.log('Booking created successfully:', data);
            console.log('Booking for Student: ', userStudentNumber)
            // Perform any additional actions after successful booking
            // Make a function for this whole thing and call it both times.
            bookingDetails = {
              consultationId: consultationId,
              studentNumber: userStudentNumber,
              role: "Organizer"
            };
            createBooking(bookingDetails)
              .then(data => {
                const message = 'Booking successful'
                const messageContainer = document.getElementById('messageContainer')
                messageContainer.textContent = message
                console.log('Booking created successfully:', data)
                bookButton.textContent = 'Book' // Change the button text back to "Book"
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
  } else {


    // if the student has selected an existing consultation, then add them to that consultation.
    selectedSlot = existingConsultationsMenu.value //get the consultationId.
    // Search for existing consultation
    const existingConsultationDetails = await getConsultationPerBooking(selectedSlot)
    console.log((existingConsultationDetails[0].date))
    
    // Change the book button text to "Loading..."
    bookButton.textContent = 'Loading...'

    const verificationStud = await getBookings(userStudentNumber)
    let hasConflict = false

    for (const booking of verificationStud) {
      const consultationId = booking.consultationId
      const consultationDetailsCheck = await getConsultationPerBooking(consultationId)
      const checkDate = consultationDetailsCheck.some(check => {
        return check.date === existingConsultationDetails[0].date
      })

      if (checkDate) {
        const overlappingConsultation = consultationDetailsCheck.find(check => {
          return (
            ((check.startTime <= String(existingConsultationDetails[0].startTime) && check.endTime > String(existingConsultationDetails[0].startTime)) ||
            (check.startTime >= String(existingConsultationDetails[0].endTime) && check.endTime < String(existingConsultationDetails[0].endTime))) && check.status === 'approved'
          )
        })

        if (overlappingConsultation) {
          const lecturerName = overlappingConsultation.lecturerId.split('@')[0].replace('.', ' ')
          const message = `Already has a consultation booked with ${lecturerName} on ${overlappingConsultation.date} at ${overlappingConsultation.startTime} - ${overlappingConsultation.endTime}`
          const messageContainer = document.getElementById('messageContainer')
          messageContainer.textContent = message
          hasConflict = true
          break
        }
      }
    }

    if (hasConflict) {
      // Change the book button text to "Error"
      bookButton.textContent = 'Error'

      // Add event listeners to the input fields
      dropdownMenu.addEventListener('change', () => {
        bookButton.textContent = 'Join' // Change the button text back to "Book"
        const messageContainer = document.getElementById('messageContainer')
        messageContainer.textContent = ''
      });

      slotDropdownMenu.addEventListener('change', () => {
        bookButton.textContent = 'Join' // Change the button text back to "Book"
        const messageContainer = document.getElementById('messageContainer')
        messageContainer.textContent = ''
      })
      return
    } else{
      // Add event listeners to the input fields
      dropdownMenu.addEventListener('change', () => {
        const messageContainer = document.getElementById('messageContainer')
        messageContainer.textContent = ''
      })

      slotDropdownMenu.addEventListener('change', () => {
        const messageContainer = document.getElementById('messageContainer')
        messageContainer.textContent = ''
      })
    }

    
    bookingDetails = {
      consultationId: selectedSlot,
      studentNumber: userStudentNumber,
      role: "Member"
    }

    createBooking(bookingDetails)
      .then(data => {
        const message = 'Booking successful'
        const messageContainer = document.getElementById('messageContainer')
        messageContainer.textContent = message
        console.log('Booking created successfully:', data)
        bookButton.textContent = 'Book'; // Change the button text back to "Book"
        // Perform any additional actions after successful booking
      })
      .catch(error => {
        console.error('Failed to create booking:', error)
        // Handle the error appropriately
      })
  }
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
  removeSubperiodDropdown()
  existingConsultationsMenu.removeAttribute('disabled') // enable existing consultations
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
        option.dataset.end = slot.endTime
        option.dataset.maxCapacity = slot.numberOfStudents
        option.dataset.maxDuration = slot.durationMinutes/slot.maximumNumberOfConsultationsPerDay
        slotDropdownMenu.add(option)
      }
    }
  }
  checkButtonStatus()
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

function formatModalBody(data) {
  console.log('data2 = ' + data)
  const consultationInfo = document.createElement("div")
  
  consultationInfo.innerHTML = `
    <strong>Lecturer:</strong> ${data.extendedProps.lecturer}<br><br>
    <strong>Start Time:</strong> ${data.start}<br><br>
    <strong>End Time:</strong> ${data.end}<br><br>
    <strong>Students attending:</strong> ${data.extendedProps.studentCount}<br><br>
    <strong>Status of consultation:</strong> ${data.extendedProps.status}<br><br>
  `
  return consultationInfo.innerHTML
}

function createConsultationDetailsModal(selectedTitle, selectedConsultationID, data) {
  const consultationDetails = document.createElement("div")
  consultationDetails.classList.add("modal", "fade")
  consultationDetails.id = "consultationDetailsModal"
  consultationDetails.setAttribute("tabindex", "-1")
  consultationDetails.setAttribute("aria-labelledby", "consultationDetailsModalLabel")
  consultationDetails.setAttribute("aria-hidden", "true")
  const modalDialog = document.createElement("div")
  modalDialog.classList.add("modal-dialog")
  consultationDetails.appendChild(modalDialog)
  const modalContent = document.createElement("div")
  modalContent.classList.add("modal-content")
  modalDialog.appendChild(modalContent)
  const modalHeader = document.createElement("div")
  modalHeader.classList.add("modal-header")
  modalContent.appendChild(modalHeader)
  const consultationTitle = document.createElement("h5")
  consultationTitle.classList.add("modal-title")
  consultationTitle.id = "consultationDetailsModalLabel"
  consultationTitle.textContent = selectedTitle.trim()
  modalHeader.appendChild(consultationTitle)
  const closeButton = document.createElement("button")
  closeButton.type = "button"
  closeButton.classList.add("btn-close")
  closeButton.setAttribute("data-bs-dismiss", "modal")
  closeButton.setAttribute("aria-label", "Close")
  modalHeader.appendChild(closeButton)
  const modalBody = document.createElement("div")
  modalBody.classList.add("modal-body")
  const consultationInfo = document.createElement("p")
  consultationInfo.innerHTML = formatModalBody(data)
  modalBody.appendChild(consultationInfo)
  modalContent.appendChild(modalBody)
  return consultationDetails
}
// Initialize the calendar
let calendar = new FullCalendar.Calendar(calendarDiv, {
  initialView: 'dayGridMonth',
  height: 'auto' // or '100%'

  //checkButtonStatus();
})
calendar.render()
//if the user presses the "show consultation" button, display the default consulation.
showConsultation.addEventListener('click', () => {
  const calendarDiv = document.querySelector('#calendar')
  // if (calendar) {
  //   calendar.removeAllEvents()
  // }
  calendar = new FullCalendar.Calendar(calendarDiv, {
    initialView: "dayGridMonth",
    height: 'auto',
    eventClick: handleEventClick // Add eventClick callback
  })
  calendar.render()
  getConsultations().then(consultations => {
   
    consultations.forEach(consultation => {
      const { date, startTime, endTime, lecturer, consultationId, studentCount, status } = consultation
      const event = {
        title: "\tConsult: " + consultationId,
        start: `${date}T${startTime}`,
        end: `${date}T${endTime}`,
        lecturer: lecturer,
        status: status,
        studentCount: studentCount,
        color: status === "approved" ? "green" : "red", // Change event color based on status
        textColor: status === "approved" ? "white" : "black", // Change text color based on status  
      }
      console.log(consultations)
      console.log('Event'+event)
      calendar.addEvent(event)
    })

  })
})

// Event click callback function
function handleEventClick(info) {
  const selectedTitle = info.event.title;
  const selectedConsultationID = parseInt(selectedTitle.split(" ")[1])
  console.log("Selected consultation title:", selectedTitle)
  console.log("Selected consultation ID:", selectedConsultationID)
  console.log("Selected consultation date:", info.event.start)
  console.log("Selected consultation end:", info.event.end)
  console.log("Selected consultation lecturer:", info.event.extendedProps.lecturer)
  
  const consultationsTextField = document.getElementById("consultations")
  const currentConsultationID = parseInt(consultationsTextField.dataset.consultationID)
  console.log("Current consultation ID:", currentConsultationID)

  if (selectedConsultationID === currentConsultationID) {
    // The same consultation is clicked again, show the modal
    const modal = document.getElementById("consultationDetailsModal")
    const consultationDetails = createConsultationDetailsModal(selectedTitle, selectedConsultationID, info.event);

    // Display the modal
    document.body.appendChild(consultationDetails)
    const bootstrapModal = new bootstrap.Modal(consultationDetails)
    bootstrapModal.show();


  } else {
    consultationsTextField.value = selectedTitle.trim()
    consultationsTextField.dataset.consultationID = selectedConsultationID
    consultationsTextField.style.textAlign = "center"

    // Remove existing modal if present
    const modal = document.getElementById("consultationDetailsModal")
    if (modal) {
      modal.remove();
    }
  }
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
  const subPeriodDropdown = document.getElementById("subPeriodDropdown");
  const slotSelected = (subPeriodDropdown !== null && subPeriodDropdown.value !== "") ? true : false;

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
          studentCount: studentCountTemp,
          status: item.status
        }
      })
      return consultations
    })
    .catch(error => console.error(error))
}

//
//fetch the consultations object stored in lecturerConsultation.js
function getStudentNumber() {

  return fetch('/class/api/studentDetails')
    .then(response => response.json())
    .then(data => {
      const studentDetails = data.map(item => {
        return {
          studentNumber: item.studentNumber,
          }
      })
      return studentDetails
    })
    .catch(error => console.error(error))
}

//get userStudentNumber and return it as a string
async function getUserStudentNumber() {
  try {
    const response = await fetch('/class/api/userStudentNumber')
    if (!response.ok) {
      throw new Error('Request failed with status code ' + response.status)
    }
    const data = await response.json()
    const studentNumber = data.toString() // Assuming the response is a single string value
    return studentNumber
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
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
  document.getElementById('durationSelector').style.display = 'none'; // Hide the duration selector
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

function getBookings(studentNumber) {
  const url = `class/api/userStudentBooking?studentNumber=${studentNumber}`
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error("Error fetching bookings:", error);
    });
}
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

function getConsultationPerBooking(consultationId) {
  const url = `class/api/consultationDetailSearchByID/${consultationId}`
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching consultation details')
      }
      return response.json()
    })
    .catch(error => {
      console.error('Error fetching consultation details:', error)
      throw error; // Re-throw the error to handle it in the calling function
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

//commented out because I dont think it is used anywhere.
// function getSubPeriod(start, duration, index){ //change when the slots are not a defined length.
//     // Create a new Date object
//     const date = new Date()

//     // Get the hours and minutes from the startTime
//     const [hours, minutes] = start.split(':')

//     // Set the hours and minutes of the Date object
//     date.setHours(hours, minutes, 0, 0) // Set seconds and milliseconds to 0

//     // Add the duration to the Date object
//     date.setMinutes(date.getMinutes() + duration*index)

//     // Extract the hours and minutes from the updated Date object
//     let startHours = date.getHours()
//     let startMinutes = date.getMinutes()
//     startHours = startHours.toString().padStart(2, '0')
//     startMinutes = startMinutes.toString().padStart(2, '0')
//     // Pad the hours and minutes with leading zeros if necessary
//     date.setMinutes(date.getMinutes() + duration)
//     // Extract the hours and minutes from the updated Date object
//     let endHours = date.getHours()
//     let endMinutes = date.getMinutes()
//     endHours = endHours.toString().padStart(2, '0')
//     endMinutes = endMinutes.toString().padStart(2, '0')

//     // Combine the hours and minutes into a string and return it
//     const startTime = `${startHours}:${startMinutes}`
//     const endTime = `${endHours}:${endMinutes}`
//     return [startTime, endTime]
// }
// Function to create and add the subperiod dropdown to the DOM
function createSubperiodDropdown(possibleSlots, duration) {
  // Calculate the number of subperiods
  removeSubperiodDropdown()
  
  // Create the subperiod dropdown
  const subperiodDropdown = document.createElement('select')
  subperiodDropdown.classList.add('form-control');
  subperiodDropdown.id = 'subperiodDropdown'
  const defaultOption = document.createElement('option')
  defaultOption.text = 'Select a consultation slot'
  defaultOption.value = ''
  subperiodDropdown.add(defaultOption)

  // Populate the dropdown with the subperiods
  for (let i = 0; i < possibleSlots.length; i++) {
    const option = document.createElement('option')
    time1 = possibleSlots[i][0]
    time2 = possibleSlots[i][1]
    option.text = `${time1} - ${time2}`
    option.value = duration//change in future.
    option.dataset.start = time1
    option.dataset.end = time2
    subperiodDropdown.add(option)
  }

  // Add the dropdown to the DOM
  dropdownContainer.appendChild(subperiodDropdown)
  subperiodDropdown.addEventListener('change', function() {
    bookButton.removeAttribute('disabled');
  });
}

// Function to remove the subperiod dropdown from the DOM
function removeSubperiodDropdown() {
  const subperiodDropdown = document.querySelector('#subperiodDropdown')
  if (subperiodDropdown) {
    dropdownContainer.removeChild(subperiodDropdown)
  }
}
//if the user presses the "hide consultation on calendar" button, hide the consultations displayed on the calendar
if (hideConsultation) {
  console.log('Clicked hide consultation button') //log to the web console
  hideConsultation.addEventListener('click', () => {
  
    // Remove all existing events from the calendar
    calendar.getEvents().forEach((event) => event.remove())

  })
}

// Event listener for when a slot is selected
slotDropdownMenu.addEventListener('change',async function() {
  if (this.value !== "") { //if a slot is selected
    existingConsultationsMenu.setAttribute('disabled', true) // disable existing consultations
    existingConsultationsMenu.selectedIndex = 0 //reset selection to default
    bookButton.textContent = "Book"
    joinExisting = false

    selectedTeacher = dropdownMenu.value
    
    const consultations = await getExistingConsultations(selectedTeacher)
    const approvedConsultations = consultations.filter(consultation => consultation.status === "approved")
    const date = slotDropdownMenu.value
    const existingConsultations = approvedConsultations.filter(consultation => consultation.date === date)
    console.log(existingConsultations)
    const slotLength = this.options[this.selectedIndex].dataset.length
    const startTime = this.options[this.selectedIndex].dataset.start
    const endTime = this.options[this.selectedIndex].dataset.end
    bookedSlots = []
    for(let i=0;i<existingConsultations.length;i++){
      start = existingConsultations[i].startTime
      end = existingConsultations[i].endTime
      bookedSlots.push([start, end])
    }
    console.log(bookedSlots)
    duration = document.getElementById("duration").value
    possibleSlots = getPossibleSlots(startTime, endTime, bookedSlots, duration)
    createSubperiodDropdown(possibleSlots, duration)

  } else { 
    existingConsultationsMenu.removeAttribute('disabled') // enable existing consultations
    bookButton.textContent = "Join"
    joinExisting = true

    // Remove the subperiod dropdown
    removeSubperiodDropdown()
  }
  checkButtonStatus()
})


function getPossibleSlots(totalStart, totalEnd, bookedSlots, duration) {
  // Create date object and set time
  const setDateTime = (time) => {
      let [hour, minute] = time.split(':')
      let date = new Date()
      date.setHours(hour, minute, 0, 0)
      return date;
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

// Existing duration adjustment code here...

slotDropdownMenu.addEventListener('change', function() {
  var selectedOption = this.value
  if (selectedOption !== '') { 
      document.getElementById('durationSelector').style.display = 'block' // Show the duration selector
      document.getElementById('duration').value = '15'
      document.getElementById('duration').dataset.maxDuration = this.options[this.selectedIndex].dataset.maxDuration
  } else {
      document.getElementById('durationSelector').style.display = 'none' // Hide the duration selector
  }
})


document.getElementById('minus').addEventListener('click', function() {
  removeSubperiodDropdown()
  var durationInput = document.getElementById('duration')
  var currentValue = parseInt(durationInput.value, 10)
  if(currentValue>0){

  }
  else{
    currentValue=15
  }
  if (currentValue > 15) { // Prevent the value from dropping below 15
      durationInput.value = currentValue - 15
  }
  showAvailableConsultations()
})

document.getElementById('plus').addEventListener('click', function() {
  removeSubperiodDropdown()
  var durationInput = document.getElementById('duration')
  const maxDuration = durationInput.dataset.maxDuration
  console.log(maxDuration)
  var currentValue = parseInt(durationInput.value, 10)
  if(currentValue>0){

  }
  else{
    currentValue=15
  }
  if (currentValue+15<=maxDuration){
  durationInput.value = currentValue + 15
  }
  showAvailableConsultations()
})

async function showAvailableConsultations(){
  selectedTeacher = dropdownMenu.value
    
  const consultations = await getExistingConsultations(selectedTeacher)
  const approvedConsultations = consultations.filter(consultation => consultation.status === "approved")
  const date = slotDropdownMenu.value
  const existingConsultations = approvedConsultations.filter(consultation => consultation.date === date)
  const slotLength = slotDropdownMenu.options[slotDropdownMenu.selectedIndex].dataset.length
  const startTime = slotDropdownMenu.options[slotDropdownMenu.selectedIndex].dataset.start
  const endTime = slotDropdownMenu.options[slotDropdownMenu.selectedIndex].dataset.end
  bookedSlots = []
  for(let i=0;i<existingConsultations.length;i++){
    start = existingConsultations[i].startTime
    end = existingConsultations[i].endTime
    bookedSlots.push([start, end])
  }
  console.log(bookedSlots)
  duration = document.getElementById("duration").value
  possibleSlots = getPossibleSlots(startTime, endTime, bookedSlots, duration)
  createSubperiodDropdown(possibleSlots, 30)
  

}
