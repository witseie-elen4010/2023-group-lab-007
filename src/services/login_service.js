function isLecturer (email) {
  return email.includes('@wits.ac.za')
}

function isStudent (email) {
  return email.includes('@students.wits.ac.za')
}

module.exports = { isLecturer, isStudent }