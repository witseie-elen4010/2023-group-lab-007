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

