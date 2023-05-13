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
// function getConsultations() {
//   console.log('user clicked get Consultations button')
//   fetch('/class/api/studentConsultations')
//     .then(response => response.json())
    // .then(data => {
    //   const consultations = data.map(item => `${item.date} ${item.time} with ${item.lecturer}`).join('<br>');
    //   document.getElementById('consultation-list').innerHTML = consultations;
    // })
//     .catch(error => console.error(error));
// }

// document.getElementById('get-consultations-button').addEventListener('click', getConsultations);

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
  return fetch('/class/api/studentConsultations')
  .then(response => response.json())
  .then(data => {
    const consultations = data.map(item => ({title: item.lecturer, date: item.date}));
    return consultations;
  })
  .catch(error => console.error(error));
}

//if the user presses the "show consultation" button, display the default consulation.
if (showConsultation) {
  console.log('Clicked show consultation button')
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