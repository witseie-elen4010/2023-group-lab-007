//const logger = require("../../logger");
const calendarBtn = document.querySelector('#calendarBtn');
const calendarDiv = document.querySelector('#calendar');

// Initialize the calendar
let calendar = new FullCalendar.Calendar(calendarDiv, {
  initialView: 'dayGridMonth',
  height: 'auto' // or '100%'
});
calendar.render();

//List of default "consultations" to display
const consultations = [
    { title: 'Consultation 1', date: '2023-05-11' },
    { title: 'Consultation 2', date: '2023-05-12' },
    { title: 'Consultation 3', date: '2023-05-13' },
];

//if the user presses the "show consultation" button, display the default consulation.
if (showConsultation) {
    showConsultation.addEventListener('click', () => {
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
}