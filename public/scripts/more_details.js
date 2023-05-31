const form1 = document.querySelector('#studentForm')
const form2 = document.querySelector('#lecturerForm')

//submission field for student details such as student number, firstname and lastname
form1.addEventListener('submit', async function (event) {
  event.preventDefault()

  // Retrieve the email value from the hidden input field
  var email = document.getElementById('email').value
  const studentNumber = document.querySelector('input[name="studentNumber"]').value
  const firstName = document.querySelector('input[name="firstName"]').value
  const lastName = document.querySelector('input[name="lastName"]').value

  const entry = {
    studentNumber: studentNumber,
    emailAddress: email,
    firstName: firstName,
    lastName: lastName,
  }

  await insertStudentDetails(entry)
  window.location.href = "/"
})

//Submssion form for lecturer details such as firstname and lastname
form2.addEventListener('submit', async function (event) {
  event.preventDefault()

  // Retrieve the email value from the hidden input field
  var email = document.getElementById('email').value
  const firstName = document.querySelector('input[name="firstName"]').value
  const lastName = document.querySelector('input[name="lastName"]').value

  const entry = {
    lecturerId: email,
    emailAddress: email,
    firstName: firstName,
    lastName: lastName,
  }

  await insertLecturerDetails(entry)
  window.location.href = "/"
})

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
      console.log('Data inserted successfully!')
    } else {
      console.log('Error occurred while inserting data.')
    }
  } catch (error) {
    console.error(error)
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
      console.log('Data inserted successfully!')
    } else {
      console.log('Error occurred while inserting data.')
    }

  } catch (error) {
    console.error(error)
  }
}
