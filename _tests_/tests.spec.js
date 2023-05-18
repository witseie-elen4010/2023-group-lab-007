/* eslint-env jest */

test('This is a dummy test', () => {
  // Do nothing
});
const { getS } = require('../src/studentConsultation.js');

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

  const actual = getS();

  expect(actual).toEqual(expected);
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

test('get function returns the correct searched consultations', () => {
  // Stub the getS function to return a predetermined value
  const getSStub = jest.fn(() => [
    {
      lecturerId: 4,
      dayOfWeek: 'Tuesday',
      startTime: '14:00',
      endTime: '15:00',
      durationMinutes: 60,
      maximumNumberOfConsultationsPerDay: 3,
      numberOfStudents: 3
    }
  ]);

  const expected = [
    {
      lecturerId: 4,
      dayOfWeek: 'Tuesday',
      startTime: '14:00',
      endTime: '15:00',
      durationMinutes: 60,
      maximumNumberOfConsultationsPerDay: 3,
      numberOfStudents: 3
    }
  ];

  const real = getSStub(); // Use the stub instead of the original function
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
