const userDataInput = document.querySelector('#user-data')
const user = JSON.parse(userDataInput.value)

function formatModalBody(data, bookingData) {
  const consultationInfo = document.createElement("div")
  consultationInfo.innerHTML = `
    <strong>Title:</strong> ${data[0].title}<br><br>
    <strong>Date:</strong> ${data[0].date}<br><br>
    <strong>Start Time:</strong> ${data[0].startTime}<br><br>
    <strong>End Time:</strong> ${data[0].endTime}<br><br>
    <strong>Time (Minutes):</strong> ${data[0].timeMinutes}<br><br>
    <strong>Maximum Number of Students:</strong> ${data[0].maximumNumberOfStudents}<br><br>
    <strong>Status:</strong> ${data[0].status}<br><br>
    <strong>Student Bookings:</strong><br><br>
  `

  // Loop through the booking data and display student number and role
  for (const booking of bookingData) {
    const studentNumber = booking.studentNumber
    const role = booking.role
    consultationInfo.innerHTML += `
      <strong>Student Number:</strong> ${studentNumber}<br>
      <strong>Role:</strong> ${role}<br><br>
    `
  }

  return consultationInfo.innerHTML
}

// Helper function to create the consultation details modal
function createConsultationDetailsModal(selectedTitle, selectedConsultationID, data, bookingData) {
  // Create the main container for the modal
  const consultationDetails = document.createElement("div")
  consultationDetails.classList.add("modal", "fade")
  consultationDetails.id = "consultationDetailsModal"
  consultationDetails.setAttribute("tabindex", "-1")
  consultationDetails.setAttribute("aria-labelledby", "consultationDetailsModalLabel")
  consultationDetails.setAttribute("aria-hidden", "true")

  // Create the modal dialog
  const modalDialog = document.createElement("div")
  modalDialog.classList.add("modal-dialog")
  consultationDetails.appendChild(modalDialog)

  // Create the modal content
  const modalContent = document.createElement("div")
  modalContent.classList.add("modal-content")
  modalDialog.appendChild(modalContent)

  // Create the modal header
  const modalHeader = document.createElement("div")
  modalHeader.classList.add("modal-header")
  modalContent.appendChild(modalHeader)

  // Create the consultation title
  const consultationTitle = document.createElement("h5")
  consultationTitle.classList.add("modal-title")
  consultationTitle.id = "consultationDetailsModalLabel"
  consultationTitle.textContent = selectedTitle.trim()
  modalHeader.appendChild(consultationTitle)

  // Create the close button
  const closeButton = document.createElement("button")
  closeButton.type = "button"
  closeButton.classList.add("btn-close")
  closeButton.setAttribute("data-bs-dismiss", "modal")
  closeButton.setAttribute("aria-label", "Close")
  modalHeader.appendChild(closeButton)

  // Create the modal body
  const modalBody = document.createElement("div")
  modalBody.classList.add("modal-body")

  // Create the consultation information
  const consultationInfo = document.createElement("p")
  consultationInfo.innerHTML = formatModalBody(data, bookingData)
  modalBody.appendChild(consultationInfo)

  modalContent.appendChild(modalBody)

  return consultationDetails
}

// Event click callback function
function handleEventClick(info) {
  const selectedConsultationID = parseInt(info.event.id)
  const selectedTitle = info.event.title
  console.log("Selected consultation ID:", selectedConsultationID)

  const consultationsTextField = document.getElementById("consultations")
  const currentConsultationID = parseInt(consultationsTextField.dataset.consultationID)
  console.log("Current consultation ID:", currentConsultationID)

  if (selectedConsultationID === currentConsultationID) {
    // The same consultation is clicked again, show the modal
    const modal = document.getElementById("consultationDetailsModal")

    // Retrieve the consultation details for the selected consultation
    fetch(`/class/api/consultationDetailSearchByID/${selectedConsultationID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Consultation details not found")
        }
        return response.json()
      })
      .then((data) => {
        // Fetch the student bookings for the consultation
        fetch(`/class/api/bookingsByConsultationId?consultationId=${selectedConsultationID}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Student bookings not found")
            }
            return response.json()
          })
          .then((bookingData) => {
            // Create the consultation details modal with the student bookings
            const consultationDetails = createConsultationDetailsModal(selectedTitle, selectedConsultationID, data, bookingData)

            // Display the modal
            document.body.appendChild(consultationDetails)
            const bootstrapModal = new bootstrap.Modal(consultationDetails)
            bootstrapModal.show()
          })
          .catch((error) => {
            console.error("Error fetching student bookings:", error)
            alert("Failed to fetch student bookings")
          })
      })
      .catch((error) => {
        console.error("Error fetching consultation details:", error)
        alert("Failed to fetch consultation details")
      })
  } else {
    consultationsTextField.value = info.event.id + ":\t" + selectedTitle.trim()
    consultationsTextField.dataset.consultationID = selectedConsultationID
    consultationsTextField.style.textAlign = "center"

    // Remove existing modal if present
    const modal = document.getElementById("consultationDetailsModal")
    if (modal) {
      modal.remove()
    }
  }
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
  const id = user.email
  fetch(`/class/api/consultationDetailSearchByLecID/${id}`)
    .then((response) => response.json())
    .then((data) => {
      // Add all the consultations to the calendar
      data.forEach((data) => {
        const start = new Date(`${data.date}T${data.startTime}`)
        const end = new Date(`${data.date}T${data.endTime}`)
        const event = {
          id: data.consultationId, // Add the id field with the consultation ID
          title: ' ' + data.title,
          start: start,
          end: end,
          date: start,
          color: data.status === "approved" ? "green" : "red", // Change event color based on status
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

// async function executeApproval() {
//   const selectedTextField = document.getElementById("consultations")
//   const consultationID = parseInt(selectedTextField.dataset.consultationID)
//   if (!consultationID) {
//     alert("Invalid consultation ID. PLease select from the calendar.")
//     return
//   }
//   console.log("Selected consultation ID:", consultationID)
//   try {
//     const response = await fetch(`/class/api/approveConsultation/${consultationID}`, {
//       method: "PUT",
//     })
//     const data = await response.json()
//     console.log("Consultation approved in the database:", data)
//   } catch (error) {
//     console.error("Error approving consultation:", error)
//   }
// }



// const approveConsultation = document.getElementById("approveConsultation") 
// if (approveConsultation) {
//   approveConsultation.addEventListener("click", () => {
//     console.log("Cancel Consultation button clicked")
//     executeApproval()
//       .then(() => {
//         displayConsultations()  // Call the function to refresh the calendar
//       })
//       .catch((error) => {
//         console.error("Error removing consultation:", error) 
//       })
//   })
// }

const cancelConsultation = document.getElementById("cancelConsultation")
if (cancelConsultation) {
  cancelConsultation.addEventListener("click", () => {
    console.log("Cancel Consultation button clicked")
    executeCancel()
      .then(() => {
        displayConsultations()  // Call the function to refresh the calendar
      })
      .catch((error) => {
        console.error("Error removing consultation:", error)
      })
  })
}