const teacherNames = [
  { 
    firstName: "John", lastName: "Doe", 
    email: "john.doe@example.com", 
    slots: [new Date("2022-06-01T09:00:00"), new Date("2022-06-03T13:00:00"), new Date("2022-06-05T15:00:00")] 
  }, 
  { 
    firstName: "Jane", lastName: "Smith", 
    email: "jane.smith@example.com", 
    slots: [new Date("2022-06-06T16:00:00")] 
  },
  { 
    firstName: "Bob", lastName: "Johnson", 
    email: "bob.johnson@example.com", 
    slots: [new Date("2022-06-01T10:00:00"), new Date("2022-06-03T14:00:00"), new Date("2022-06-05T16:00:00")] 
  },
  { 
    firstName: "Mary", lastName: "Brown", 
    email: "mary.brown@example.com", 
    slots: [new Date("2022-06-02T09:00:00"), new Date("2022-06-04T13:00:00"), ] 
  }
];

const dropdownMenu = document.querySelector('#teacherList');
const consultationSlots = document.querySelector('#consultationSlots');

for (let i = 0; i < teacherNames.length; i++) {
  const teacher = teacherNames[i];
  const fullName = `${teacher.firstName} ${teacher.lastName}`;

  const option = document.createElement("option");
  option.text = fullName;
  option.value = teacher.email;
 
  dropdownMenu.appendChild(option);
}

const dropdownToggle = document.querySelector('#teacherListDropdown');
dropdownToggle.addEventListener('click', (e) => {
  e.preventDefault();
  dropdownMenu.classList.toggle('show');
  console.log('Clicked teacher dropdown [unknown user]');
});

dropdownMenu.addEventListener('change', (e) => {
  const teacherEmail = e.target.value;
  const selectedTeacher = teacherNames.find(teacher => teacher.email === teacherEmail);
  console.log(`Selected teacher: ${selectedTeacher ? selectedTeacher.firstName + ' ' + selectedTeacher.lastName : 'none'} [unknown user]`);
  if (selectedTeacher) {
    const slots = selectedTeacher.slots;
    const slotList = document.createElement("ul");

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const slotItem = document.createElement("li");
      slotItem.innerText = slot.toLocaleString();

      slotList.appendChild(slotItem);
    }

    consultationSlots.innerHTML = '';
    consultationSlots.appendChild(slotList);
  } else {
    consultationSlots.innerHTML = '';
  }
});
function getConsultations() {
  console.log('user clicked get Consultations button')
  fetch('/class/api/studentConsultations')
    .then(response => response.json())
    .then(data => {
      const consultations = data.map(item => `${item.date} ${item.time} with ${item.lecturer}`).join('<br>');
      document.getElementById('consultation-list').innerHTML = consultations;
    })
    .catch(error => console.error(error));
}

document.getElementById('get-consultations-button').addEventListener('click', getConsultations);

function searchConsultations() {
  const searchDay = document.getElementById("searchDay").value
  const url = `/consultationPeriodsSearch?dayOfWeek=${searchDay}`


  // Make an AJAX request to the server to fetch consultation periods
  fetch(url)
      .then(response => response.json())
      .then(data => {
          // Process the returned data and display results
          displayResults(data);
      })
      .catch(error => {
          console.error("Error fetching consultation periods:", error);
      });
}

function displayResults(results) {
  const searchResultsDiv = document.getElementById("searchResults");
  searchResultsDiv.innerHTML = ""; // Clear previous results

  if (results.length === 0) {
      searchResultsDiv.innerHTML = "No consultations found for the selected day.";
  } else {
      const ul = document.createElement("ul");
      results.forEach(result => {
          const li = document.createElement("li");
          li.innerHTML = `
              <p>Day of the week: ${result.dayOfWeek}</p>
              <p>Start Time: ${result.startTime}</p>
              <p>End Time: ${result.endTime}</p>
              <p>Duration: ${result.durationMinutes} minutes</p>
              <p>Max Consultations per Day: ${result.maximumNumberOfConsultationsPerDay}</p>
              <p>Number of Students: ${result.numberOfStudents}</p>
          `;
          ul.appendChild(li);
      });
      searchResultsDiv.appendChild(ul);
  }
}