const teacherNames = [
  { 
    firstName: "John", lastName: "Doe", 
    email: "john.doe@example.com", 
    slots: [
      {day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
      maxStudents : 5,
    },
    
    {day: "Tuesday",
    startTime: "10:00",
    endTime: "11:00",
    maxStudents : 6,
    }
  ]
  }, 
  { 
    firstName: "Jane", lastName: "Smith", 
    email: "jane.smith@example.com", 
    slots: [
      {day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
      maxStudents : 5,
    },
    
    {day: "Tuesday",
    startTime: "10:00",
    endTime: "11:00",
    maxStudents : 6,
    }
  ]
  },
  { 
    firstName: "Bob", lastName: "Johnson", 
    email: "bob.johnson@example.com", 
    slots: [
      {day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
      maxStudents : 5,
    },
    
    {day: "Tuesday",
    startTime: "10:00",
    endTime: "11:00",
    maxStudents : 6,
    }
  ]
  },
  { 
    firstName: "Mary", lastName: "Brown", 
    email: "mary.brown@example.com", 
    slots: [
      {day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
      maxStudents : 5,
    },
    
    {day: "Tuesday",
    startTime: "10:00",
    endTime: "11:00",
    maxStudents : 6,
    }
  ]
  }
];

const daysOfWeek={Sunday:0,
  Monday:1,
  Tuesday:2,
  Wednesday:3,
  Thursday:4,
  Friday:5,
  Saturday:6
}
const dropdownMenu = document.querySelector('#teacherList');
const slotDropdownMenu = document.querySelector('#slotList');
const bookButton = document.querySelector('#bookButton');
const defaultOption = document.createElement("option");
const userDataInput = document.querySelector('#user-data');
const user = JSON.parse(userDataInput.value);

defaultOption.text = "Select a teacher";
defaultOption.value = "";
dropdownMenu.appendChild(defaultOption);
dropdownMenu.selectedIndex = 0; // Set the default option as selected
for (let i = 0; i < teacherNames.length; i++) {
  const teacher = teacherNames[i];
  const fullName = `${teacher.firstName} ${teacher.lastName}`;

  const option = document.createElement("option");
  option.text = fullName;
  option.value = teacher.email;
 
  dropdownMenu.appendChild(option);
}

function getDateString(date){
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth returns a zero-based value (where 0 is January)
  const day = date.getDate();
  
  const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  //option.text = formattedDate;
  return formattedDate
}

function checkButtonStatus() {
  const teacherSelected = dropdownMenu.value !== "";
  const slotSelected = slotDropdownMenu.value !== "";

  if (teacherSelected && slotSelected) {
    bookButton.removeAttribute('disabled');
  } else {
    bookButton.setAttribute('disabled', 'true');
  }
}
function getNextDate(day) {
  const today = new Date();
  const targetDay = daysOfWeek[day];
  if (targetDay !== undefined) {
    const daysUntilNextTargetDay = (targetDay - today.getDay() + 7) % 7;
    today.setDate(today.getDate() + daysUntilNextTargetDay);
    return today;
  } else {
    throw new Error(`Invalid day name: ${dayName}`);
  }
}

dropdownMenu.addEventListener('change', (e) => {
  const teacherEmail = e.target.value;
  const selectedTeacher = teacherNames.find(teacher => teacher.email === teacherEmail);
  
  // Clear out the previous slots
  while (slotDropdownMenu.options.length > 0) {
    slotDropdownMenu.remove(0);
  }

  if (selectedTeacher) {
    const slots = selectedTeacher.slots;

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const option = document.createElement("option");
      option.text = getDateString(getNextDate(slot.day))+' '+slot.startTime+'-'+slot.endTime;
      option.value = i;

      slotDropdownMenu.add(option);
    }
  }
  
  checkButtonStatus();
});


slotDropdownMenu.addEventListener('change', (e) => {
  const slotIndex = e.target.value;
  //console.log(`Selected slot: ${slotIndex}`);
  
  // Enable the book button when a slot is selected
  checkButtonStatus();
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
bookButton.addEventListener('click', () => {
  const selectedTeacherEmail = dropdownMenu.value;
  const selectedSlotIndex = slotDropdownMenu.value;

  const selectedTeacher = teacherNames.find(teacher => teacher.email === selectedTeacherEmail);
  const selectedSlot = selectedTeacher ? selectedTeacher.slots[selectedSlotIndex] : null;

  //console.log(`Selected lecturer: ${selectedTeacher ? selectedTeacher.firstName + ' ' + selectedTeacher.lastName : 'none'} );
  //console.log(`Selected timeslot: ${selectedSlot ? selectedSlot.toLocaleString() : 'none'}`);
  console.log(`${user.given_name} has booked a consultation with ${selectedTeacher ? selectedTeacher.firstName + ' ' + selectedTeacher.lastName : 'none'} at ${selectedSlot ? getDateString(getNextDate(selectedSlot.day)) : 'none'}`)
});

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