//const logger = require("../../logger");
const calendarBtn = document.querySelector('#calendarBtn');
const calendarDiv = document.querySelector('#calendar');

// Initialize the calendar
let calendar = new FullCalendar.Calendar(calendarDiv, {
  initialView: 'dayGridMonth',
  height: 'auto' // or '100%'
});
calendar.render();

//fetch the consultations object stored in lecturerConsultation.js
function getConsultations() {
  return fetch('/class/api/lecturerConsultations')
    .then(response => response.json())
    .then(data => {
      const consultations = data.map(item => ({title: item.title, date: item.date}));
      return consultations;
    })
    .catch(error => console.error(error));
}

//if the user presses the "show consultation" button, display the default consulation.
if (showConsultation) {
  showConsultation.addEventListener('click', () => {
    getConsultations().then(consultations => {
      console.log("[Unknown User] clicked show consultation button")
      if (!calendar) {
        calendar = new FullCalendar.Calendar(calendarDiv, {
          initialView: 'dayGridMonth',
        });
        calendar.render();
      }
      
      // Add all the consultations to the calendar
      consultations.forEach(event => {
        calendar.addEvent(event);
      });
    });
  });
}