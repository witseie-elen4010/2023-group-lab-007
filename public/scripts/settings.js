const form = document.querySelector('#consPeriod');
const entryList = document.getElementById('entryList');
let entries = [];

function handleEmail(email) {
  console.log(email);
  getConsultationPeriods(email)
}

// Submission form for consultation settings
form.addEventListener('submit', (event) => {
  event.preventDefault();

  var email = document.getElementById('email').value;
  const dayOfWeek = document.getElementById('dayOfWeek').value;
  const startTime = document.querySelector('input[name="start_time"]').value;
  const endTime = document.querySelector('input[name="end_time"]').value;
  const maxStudents = document.querySelector('input[name="maxStudents"]').value;
  const maxConsultations = document.querySelector('input[name="maxConsultations"]').value;
  const duration = document.querySelector('select[name="maxDuration"]').value;
  const randomNumber = (Math.floor(Math.random() * 1000) + 1);

  const entry = {
    lecturerId: email,
    dayOfWeek: dayOfWeek,
    startTime: startTime,
    endTime: endTime,
    durationMinutes: duration,
    maximumNumberOfConsultationsPerDay: maxConsultations,
    numberOfStudents: maxStudents,
  };

  entries.push(entry);
  displayEntries();

  insertConsultationPeriods(entry);
});

//Insert consultation settings into the database
async function insertConsultationPeriods(entry) {
  try {

    const response = await fetch('/class/api/consultationPeriods', {
      method: 'POST',
      body: JSON.stringify(entry),
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      }
    })

    if (response.status === 200) {
      console.log('Data inserted successfully!');
    } else {
      console.log('Error occurred while inserting data.');
    }
  } catch (error) {
    console.error(error);
  }
}

//Delete consultation settings from the database
async function deleteConsultationPeriod(lecturerID, dayOfWeek) {
  try {
    const details = { lecturerID: lecturerID, dayOfWeek: dayOfWeek }

    const response = await fetch('/class/api/removeConsultationPeriod', {
      method: 'DELETE',
      body: JSON.stringify(details),
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      }
    })

    if (response.status === 200) {
      console.log('Data deleted successfully!');
    } else {
      console.log('Error occurred while inserting data.');
    }
  } catch (error) {
    console.error(error);
  }
}

//Insert consultation settings into the database
async function getConsultationPeriods(lecturerID) {
  console.log(lecturerID)
  try {
    const response = await fetch(`/class/api/existingConsultationPeriods/${lecturerID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      }
    }).then(response => response.json())
      .catch(error => console.error('Error fetching consultation periods:', error))

    for (let i = 0; i < Object.keys(response).length; i++) {
      const period = response[i]

      const entry = {
        lecturerId: period.lecturerId,
        dayOfWeek: period.dayOfWeek,
        startTime: period.startTime,
        endTime: period.endTime,
        durationMinutes: period.durationMinutes,
        maximumNumberOfConsultationsPerDay: period.maximumNumberOfConsultationsPerDay,
        numberOfStudents: period.numberOfStudents,
      };
      entries.push(entry);
    }

    displayEntries();

    if (response.status === 200) {
      console.log('Data fetched successfully!');
    } else {
      console.log('Error occurred while inserting data.');
    }
  } catch (error) {
    console.error(error);
  }
}


//Display existing consultation settings as a list
function displayEntries() {
  entryList.innerHTML = '';

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const listItem = document.createElement('li');
    listItem.innerHTML = `
    <div style="padding: 10px">
      ${i + 1}. ${entry.dayOfWeek} - ${entry.startTime} to ${entry.endTime} where ${entry.maximumNumberOfConsultationsPerDay} consultations of ${entry.durationMinutes} minutes can be booked with a max of ${entry.numberOfStudents} students per consultation.
      <div><button class="btn btn-danger btn-sm deleteEntry"  data-index="${i}">Delete</button></div>
      </div>
    `;
    entryList.appendChild(listItem);
  }

  //Delete button calls the delete consultation function for that consultation 
  const deleteButtons = document.querySelectorAll('.deleteEntry');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const index = parseInt(event.target.getAttribute('data-index'));
      deleteConsultationPeriod(entries[index].lecturerId, entries[index].dayOfWeek);
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



