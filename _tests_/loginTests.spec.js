/* eslint-env jest */

const { isLecturer, isStudent } = require('../src/services/login_service');

describe('emailVerification', () => {

  describe('isLecturer', () => {
    test('should return true for a lecturer email', () => {
      const email = 'john.doe@wits.ac.za';
      expect(isLecturer(email)).toBe(true);
    });

    test('should return false for a non-lecturer email', () => {
      const email = 'jane.doe@gmail.com';
      expect(isLecturer(email)).toBe(false);
    });

    test('should return false when the email does not contain the domain', () => {
      const email = 'john.doe@wits.com';
      expect(isLecturer(email)).toBe(false);
    });
  });

  describe('isStudent', () => {
    test('should return true for a student email', () => {
      const email = 'john.doe@students.wits.ac.za';
      expect(isStudent(email)).toBe(true);
    });

    test('should return false for a non-student email', () => {
      const email = 'jane.doe@gmail.com';
      expect(isStudent(email)).toBe(false);
    });

    test('should return false when the email does not contain the domain', () => {
      const email = 'john.doe@students.wits.com';
      expect(isStudent(email)).toBe(false);
    });
  });
});
