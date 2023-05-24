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

function displayConsultations() {
  const calendarDiv = document.querySelector('#calendar')
  calendar = new FullCalendar.Calendar(calendarDiv, {
    initialView: "dayGridMonth",
    height: 'auto',
    eventClick: handleEventClick // Add eventClick callback
  })
  calendar.render();
  // Retrieve the lecturer ID (email address with auth0)
  //const id = req.oidc.user.email
  const id = "Robert.Taylor@wits.ac.za"
  fetch(`/class/api/consultationDetailSearch/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Remove all existing events from the calendar
      calendar.getEvents().forEach((event) => event.remove())
      // Add all the consultations to the calendar
      data.forEach((data) => {
        const start = new Date(`${data.date}T${data.startTime}`)
        const end = new Date(`${data.date}T${data.endTime}`)
        const event = {
          title: "\tConsultation " + data.consultationId,
          start: start,
          end: end,
          date: start,
          backgroundColor: data.status === "approved" ? "green" : "red", // Change event color based on status
        };
        calendar.addEvent(event)
      });
    })
    .catch((error) => {
      console.error("Error fetching consultations:", error)
    })
}
// Call displayConsultations when the webpage is loaded
window.onload = displayConsultations

async function executeApproval() {
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
    const response = await fetch(`/class/api/approveConsultation/${consultationID}`, {
      method: "PUT",
    })
    const data = await response.json()
    console.log("Consultation approved in the database:", data)
  } catch (error) {
    console.error("Error approving consultation:", error)
  }
}

async function executeCancel() {
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
      return;
    }
    const response = await fetch(`/class/api/cancelConsultation/${consultationID}`, {
      method: "DELETE",
    })
    const data = await response.json()
    console.log("Consultation cancelled in the database:", data)
  } catch (error) {
    console.error("Error cancelling consultation:", error)
  }
}

const approveConsultation = document.getElementById("approveConsultation") 
if (approveConsultation) {
  approveConsultation.addEventListener("click", () => {
    console.log("Cancel Consultation button clicked") 
    executeApproval().catch((error) => {
      console.error("Error removing consultation:", error) 
    }) 
  }) 
}

const cancelConsultation = document.getElementById("cancelConsultation") 
if (cancelConsultation) {
  cancelConsultation.addEventListener("click", () => {
    console.log("Cancel Consultation button clicked") 
    executeCancel().catch((error) => {
      console.error("Error removing consultation:", error) 
    }) 
  }) 
}