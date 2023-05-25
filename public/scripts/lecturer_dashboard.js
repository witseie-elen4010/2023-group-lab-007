// Event click callback function
function handleEventClick(info) {
  const selectedTitle = info.event.title
  const selectedConsultationID = parseInt(selectedTitle.split(" ")[1])
  console.log("Selected consultation title:", selectedTitle)
  console.log("Selected consultation ID:", selectedConsultationID)

  const consultationsTextField = document.getElementById("consultations")
  consultationsTextField.value = selectedTitle.trim()
  consultationsTextField.dataset.consultationID = selectedConsultationID
  consultationsTextField.style.textAlign = "center"
}

let calendar // Declare the calendar variable

function displayConsultations() {
  const calendarDiv = document.querySelector('#calendar')
  // Clear the calendar if it has already been generated
  if (calendar) {
    calendar.removeAllEvents()
    calendar.destroy()
  }
  calendar = new FullCalendar.Calendar(calendarDiv, {
    initialView: "dayGridMonth",
    height: 'auto',
    eventClick: handleEventClick // Add eventClick callback
  })
  calendar.render()

  // Retrieve the lecturer ID (email address with auth0)
  //const id = req.oidc.user.email
  const id = "Robert.Taylor@wits.ac.za"
  fetch(`/class/api/consultationDetailSearchByID/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      // Add all the consultations to the calendar
      data.forEach((data) => {
        const start = new Date(`${data.date}T${data.startTime}`)
        const end = new Date(`${data.date}T${data.endTime}`)
        const event = {
          title: "\tConsultation " + data.consultationId,
          start: start,
          end: end,
          date: start,
          color: data.status === "approved" ? "green" : "red", // Change event color based on status
          textColor: data.status === "approved" ? "white" : "black", // Change text color based on status
        }
        calendar.addEvent(event)
      })
    })
    .catch((error) => {
      console.error("Error fetching consultations:", error)
    })
}

// Call displayConsultations when the webpage is loaded
window.onload = displayConsultations

async function executeApproval() {
  const selectedTextField = document.getElementById("consultations")
  const consultationID = parseInt(selectedTextField.dataset.consultationID)
  if (!consultationID) {
    alert("Invalid consultation ID. PLease select from the calendar.")
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
  const selectedTextField = document.getElementById("consultations")
  const consultationID = parseInt(selectedTextField.dataset.consultationID)
  if (!consultationID) {
    alert("Invalid consultation ID. PLease select from the calendar.")
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

const approveConsultation = document.getElementById("approveConsultation");
if (approveConsultation) {
  approveConsultation.addEventListener("click", () => {
    console.log("Cancel Consultation button clicked")
    executeApproval()
      .then(() => {
        displayConsultations(); // Call the function to refresh the calendar
      })
      .catch((error) => {
        console.error("Error removing consultation:", error);
      })
  })
}

const cancelConsultation = document.getElementById("cancelConsultation")
if (cancelConsultation) {
  cancelConsultation.addEventListener("click", () => {
    console.log("Cancel Consultation button clicked")
    executeCancel()
      .then(() => {
        displayConsultations(); // Call the function to refresh the calendar
      })
      .catch((error) => {
        console.error("Error removing consultation:", error)
      })
  })
}
