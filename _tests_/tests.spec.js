/* eslint-env jest */

const student_dashboard = require('../public/scripts/student_dashboard.js')
test('This is a dummy test', () => {
  // Do nothing
});

const { get } = require('../src/lecturerConsultation.js');

test('get function returns the list of lecturer consultations stored in the source file', () => {
  const expected = [
    { title: 'Consultation 1', date: '2023-05-11' },
    { title: 'Consultation 2', date: '2023-05-12' },
    { title: 'Consultation 3', date: '2023-05-13' },
];
  const real = get();

  expect(real).toEqual(expected);
});

// EXAMPLE JEST TEST

// import functions

// const students = require('../classList.js')

// describe('Dummy', () => {
//   beforeEach(() => {
//     // Clear the list before each test
//     students.delete(0)
//     students.delete(0)
//   })

//   test('adds a student to the list', () => {
//     const student = { name: 'John Doe', age: 20 }
//     students.add(student)
//     expect(students.all()).toContain(student)
//   })

//   test('edits a student in the list', () => {
//     const originalStudent = { name: 'John Doe', age: 20 }
//     const editedStudent = { name: 'Jane Doe', age: 22 }
//     students.add(originalStudent)
//     students.edit(editedStudent, 0)
//     expect(students.all()).toContain(editedStudent)
//     expect(students.all()).not.toContain(originalStudent)
//   })

//   test('gets a student from the list', () => {
//     const student = { name: 'John Doe', age: 20 }
//     students.add(student)
//     expect(students.get(0)).toBe(student)
//   })

//   test('deletes a student from the list', () => {
//     const student = { name: 'John Doe', age: 20 }
//     students.add(student)
//     students.delete(0)
//     expect(students.all()).not.toContain(student)
//   })

//   test('returns all students in the list', () => {
//     const student1 = { name: 'John Doe', age: 20 }
//     const student2 = { name: 'Jane Doe', age: 22 }
//     students.add(student1)
//     students.add(student2)
//     expect(students.all()).toEqual([student1, student2])
//   })
// })
