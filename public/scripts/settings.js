const form = document.querySelector('#consPeriod');
const maxStudentsForm = document.querySelector('#maximumStudents');
const maxConsultationsForm = document.querySelector('#maximumConsultations');
const maxDurationForm = document.querySelector('#maximumDuration');
const entryList = document.getElementById('entryList');
let entries = [];

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const dayOfWeek = document.getElementById('dayOfWeek').value;
  const startTime = document.querySelector('input[name="start_time"]').value;
  const endTime = document.querySelector('input[name="end_time"]').value;

  const entry = {
    dayOfWeek,
    startTime,
    endTime
  };

  entries.push(entry);

  displayEntries();
});

maxStudentsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const maxStudents = document.querySelector('input[name="maxStudents"]').value;
});

maxConsultationsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const maxConsultations = document.querySelector('input[name="maxConsultations"]').value;
});

maxDurationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const maxDuration = document.querySelector('select[name="maxDuration"]').value;
});

function displayEntries() {
  entryList.innerHTML = '';

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const listItem = document.createElement('li');
    listItem.innerHTML = `
    <div style="padding: 10px">
      ${i + 1}. ${entry.dayOfWeek} - ${entry.startTime} to ${entry.endTime}
      <button class="btn btn-danger btn-sm float-right deleteEntry"  data-index="${i}">Delete</button>
      </div>
    `;
    entryList.appendChild(listItem);
  }

  const deleteButtons = document.querySelectorAll('.deleteEntry');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const index = parseInt(event.target.getAttribute('data-index'));
      entries.splice(index, 1);
      displayEntries();
    });
  });
}

// Wait for the page to finish loading
$(document).ready(function () {

  flatpickr('#timepicker', {
    enableTime: true,
    noCalendar: true,
    dateFormat: "h:i K",
    time_24hr: false,
    minuteIncrement: 15
  });

  // Initialize the timepicker plugin on the input field with ID "timepicker"
  $("#timepicker").datetimepicker({
    format: "LT",
    icons: {
      up: "fa fa-chevron-up",
      down: "fa fa-chevron-down"
    }
  });

  // Code to disable options not divisible by 15
  $("#durationPicker option").each(function () {
    var value = parseInt($(this).val());
    if (value % 15 !== 0) {
      $(this).prop("disabled", true);
    }
  });
});

