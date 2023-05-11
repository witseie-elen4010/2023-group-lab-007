/* eslint-env jest */

test('This is a dummy test', () => {
  // Do nothing
});
const { get } = require('../src/studentConsultation.js');

test('get function returns the correct list of consultations', () => {
  const expected = [
    {
      date: '2023-05-15',
      time: '10:00 - 12:00',
      lecturer: 'John Doe'
    },
    {
      date: '2023-05-17',
      time: '14:00 - 16:00',
      lecturer: 'Jane Smith'
    },
    {
      date: '2023-05-19',
      time: '09:00 - 11:00',
      lecturer: 'Bob Johnson'
    }
  ];

  const actual = get();

  expect(actual).toEqual(expected);
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
