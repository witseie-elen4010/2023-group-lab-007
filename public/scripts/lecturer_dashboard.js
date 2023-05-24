const options = []

// Populate the options array with numbers between 1 and 10
for (let i = 1; i <= 10; i++){
  options.push(i)
}

// Get a reference to the select element
const select = document.getElementById('options')

// Loop through the options array and create an option element for each one
options.forEach((option) => {
  const optionElem = document.createElement('option')
  optionElem.value = option
  optionElem.textContent = option
  select.appendChild(optionElem)
})

// Create an empty array to store the selected options
const selectedOptions = []

// Define a function to store the selected option in the array when an option is selected
function storeOption() {
  const selectedOption = parseInt(select.value)
  console.log(`Selected option: ${selectedOption}`)
  selectedOptions.push(selectedOption)
  updateList()
}

// Define a function to update the list of selected options
function updateList() {
  const list = document.getElementById('numberList')
  list.innerHTML = ''
  selectedOptions.forEach((option) => {
    const listItem = document.createElement('li')
    // Set the text content of the list item element to the current selected option
    listItem.textContent = option
    list.appendChild(listItem)
  })
}

const calendarDiv = document.querySelector('#calendar')

// Event click callback function
function handleEventClick(info) {
  const selectedTitle = info.event.title
  const selectedConsultationID = parseInt(selectedTitle.split(" ")[1])
  console.log("Selected consultation title:", selectedTitle)
  console.log("Selected consultation ID:", selectedConsultationID)
  const consultationsDropdown = document.getElementById("consultations")
  // Remove previous options from the dropdown
  while (consultationsDropdown.firstChild) {
    consultationsDropdown.removeChild(consultationsDropdown.firstChild)
  }
  // Add the selected event title as the only option in the dropdown
  const optionElem = document.createElement('option')
  optionElem.value = selectedTitle
  optionElem.textContent = selectedTitle
  optionElem.dataset.consultationID = selectedConsultationID
  consultationsDropdown.appendChild(optionElem)
}

// Initialize the calendar with eventClick callback
let calendar = new FullCalendar.Calendar(calendarDiv, {
  initialView: 'dayGridMonth',
  height: 'auto',
  eventClick: handleEventClick
})
calendar.render()

function getConsultations() {
  const url = '/class/api/consultationDetailSearch'
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const result = data.map(item => ({
        title:'With' + item.consultationId, // Update to the correct property name
        date: item.date, // Update to the correct property name
        startTime: item.startTime,
        endTime: item.endTime
      }))
      console.log(result)
      return result
    })
    .catch((error) => {
      console.error("Error fetching consultations:", error)
    })
}

function displayConsultations(consultations) {
  console.log("[Unknown User] clicked show consultation button")
  if (!calendar) {
    calendar = new FullCalendar.Calendar(calendarDiv, {
      initialView: "dayGridMonth",
      eventClick: handleEventClick // Add eventClick callback
    })
    calendar.render()
  }
  // Remove all existing events from the calendar
  calendar.getEvents().forEach((event) => event.remove())
  // Add all the consultations to the calendar
  consultations.forEach((consultation) => {
    const start = new Date(`${consultation.date}T${consultation.startTime}`)
    const end = new Date(`${consultation.date}T${consultation.endTime}`)
    const event = {
      title: "\tConsultation " + consultation.title,
      start: start,
      end: end,
      date: start,
    }
    calendar.addEvent(event)
  })
}

const showConsultation = document.getElementById("showConsultation")
if (showConsultation) {
  showConsultation.addEventListener("click", () => {
    console.log("Show Consultation button clicked")  // Check if this message is logged when the button is clicked
    getConsultations()
      .then((data) => {
        console.log(data)
        displayConsultations(data)
      })
      .catch((error) => {
        console.error("Error fetching consultations:", error)
      })
  })
}

async function removeConsultation() {
  const selectedOption = document.getElementById("consultations").options[0] 
  console.log(selectedOption) 
  if (!selectedOption) {
    console.log("No event selected from the calendar") 
    return
  }

  const consultationID = parseInt(selectedOption.dataset.consultationID) 
  if (!consultationID) {
    console.error("Invalid consultation ID") 
    return 
  }
  console.log("Selected consultation ID:", consultationID) 

  try {
    const confirmation = confirm("Are you sure you want to cancel the consultation?") 
    if (!confirmation) {
      console.log("Consultation cancellation canceled by user") 
      return 
    }
    const response = await fetch(`/class/api/removeConsultation/${consultationID}`, {
      method: "DELETE",
    }) 
    const data = await response.json() 
    console.log("Consultation removed from the database:", data) 

    // Refresh the consultations on the calendar
    const consultations = await getConsultations() 
    displayConsultations(consultations) 
  } catch (error) {
    console.error("Error removing consultation:", error) 
  }
}

const cancelConsultation = document.getElementById("cancelConsultation") 
if (cancelConsultation) {
  cancelConsultation.addEventListener("click", () => {
    console.log("Cancel Consultation button clicked") 
    removeConsultation().catch((error) => {
      console.error("Error removing consultation:", error) 
    }) 
  }) 
}