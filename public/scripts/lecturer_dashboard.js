const options = [];

// Populate the options array with numbers between 1 and 10
for (let i = 1; i <= 10; i++) {
  options.push(i);
}

// Get a reference to the select element
const select = document.getElementById('options');

// Loop through the options array and create an option element for each one
options.forEach((option) => {
  const optionElem = document.createElement('option');
  optionElem.value = option;
  optionElem.textContent = option;
  select.appendChild(optionElem);
});

// Create an empty array to store the selected options
const selectedOptions = [];

// Define a function to store the selected option in the array when an option is selected
function storeOption() {
  const selectedOption = parseInt(select.value);
  console.log(`Selected option: ${selectedOption}`);
  selectedOptions.push(selectedOption);
  updateList();
}

// Define a function to update the list of selected options
function updateList() {
  const list = document.getElementById('numberList');
  list.innerHTML = '';
  selectedOptions.forEach((option) => {
    const listItem = document.createElement('li');
    // Set the text content of the list item element to the current selected option
    listItem.textContent = option;
    list.appendChild(listItem);
  });
}


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

calendar.on('dateClick', function(info) {
  const clickedDate = info.dateStr;
  fetch(`/class/api/lecturerConsultations?date=${clickedDate}`)
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('consultations');
      select.innerHTML = '';
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.title;
        option.textContent = item.title;
        select.appendChild(option);
      });
    })
    .catch(error => console.error(error));
});

const cancelBtn = document.querySelector('#cancelConsultation');
cancelBtn.addEventListener('click', function() {
  const selectedConsultation = document.getElementById('consultations').value;
  const selectedDate = calendar.getDate().toISOString().substring(0, 10);
  fetch(`/class/api/lecturerConsultations?date=${selectedDate}&title=${selectedConsultation}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Refresh the calendar to reflect the cancelled consultation
      calendar.refetchEvents();
    })
    .catch(error => console.error(error));
});
