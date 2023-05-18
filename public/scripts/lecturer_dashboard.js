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

const calendarDiv = document.querySelector('#calendar');

// Initialize the calendar
let calendar = new FullCalendar.Calendar(calendarDiv, {
  initialView: 'dayGridMonth',
  height: 'auto' // or '100%'
});
calendar.render();

function getConsultations() {
  const url = '/consultationDetailSearch';

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const result = data.map(item => ({
        title: "\tConsultation " + item.consultationId, // Update to the correct property name
        date: item.date, // Update to the correct property name
        startTime: item.startTime,
        endTime: item.endTime
      }));
      console.log(result)
      return result
    })
    .catch((error) => {
      console.error("Error fetching consultations:", error);
    });
}

// Display the consultations on the calendar
function displayConsultations(consultations) {
  console.log("[Unknown User] clicked show consultation button");
  if (!calendar) {
    calendar = new FullCalendar.Calendar(calendarDiv, {
      initialView: "dayGridMonth",
    });
    calendar.render();
  }
  // Remove all existing events from the calendar
  calendar.getEvents().forEach((event) => event.remove());
  // Add all the consultations to the calendar
  consultations.forEach((consultation) => {
    const start = new Date(`${consultation.date}T${consultation.startTime}`);
    const end = new Date(`${consultation.date}T${consultation.endTime}`);
    const event = {
      title: consultation.title,
      start: start,
      end: end,
      date: start,
    };
    calendar.addEvent(event);
  });
}

const showConsultation = document.getElementById("showConsultation");
if (showConsultation) {
  showConsultation.addEventListener("click", () => {
    getConsultations()
      .then((data) => {
        console.log(data)
        displayConsultations(data);
      })
      .catch((error) => {
        console.error("Error fetching consultations:", error);
      });
  });
}