const form1 = document.querySelector('#studentForm');
const form2 = document.querySelector('#lecturerForm');

form1.addEventListener('submit', function (event) {
  event.preventDefault();

  // Retrieve the email value from the hidden input field
  var email = document.getElementById('email').value;
  const studentNumber = document.querySelector('input[name="studentNumber"]').value;
  const firstName = document.querySelector('input[name="firstName"]').value;
  const lastName = document.querySelector('input[name="lastName"]').value;

  const entry = {
    studentNumber: studentNumber,
    emailAddress: email,
    firstName: firstName,
    lastName: lastName,
  };

  insertStudentDetails(entry);
  window.location.href = "/";
});

form2.addEventListener('submit', function (event) {
  event.preventDefault();

  // Retrieve the email value from the hidden input field
  var email = document.getElementById('email').value;
  const firstName = document.querySelector('input[name="firstName"]').value;
  const lastName = document.querySelector('input[name="lastName"]').value;

  const entry = {
    lecturerId: email,                       
    emailAddress: email,
    firstName: firstName,
    lastName: lastName,
  };

  insertLecturerDetails(entry);
  window.location.href = "/";
});

//Insert lecturer details into the database
async function insertLecturerDetails(entry) {
  try {

    const response = await fetch('/class/api/lecturerDetails', {
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

//Insert student details into the database
async function insertStudentDetails(entry) {
  try {
    const response = await fetch('/class/api/studentDetails', {
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
