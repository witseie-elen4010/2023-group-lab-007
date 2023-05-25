const { checkForOverlap, convertToMinutes } = require('../public/scripts/services/settings_service');

describe('periodEvaluation', () => {
  describe('checkForOverlap', () => {
    let entries;

    beforeEach(() => {
      entries = [
        { dayOfWeek: 'monday', startTime: '10:00 AM', endTime: '12:00 PM' },
        { dayOfWeek: 'tuesday', startTime: '02:00 PM', endTime: '04:00 PM' },
      ];
    });

    test('should return false for a non-overlapping period', () => {
      const dayOfWeek = 'wednesday';
      const startTime = convertToMinutes('01:00 PM');
      const endTime = convertToMinutes('03:00 PM');
      expect(checkForOverlap(dayOfWeek, startTime, endTime, entries)).toBe(false);
    });

    test('should return true for an overlapping period', () => {
      const dayOfWeek = 'tuesday';
      const startTime = convertToMinutes('05:00 PM');
      const endTime = convertToMinutes('04:00 PM');
      expect(checkForOverlap(dayOfWeek, startTime, endTime, entries)).toBe(true);
    });

    test('should return true for start time after end time', () => {
      const dayOfWeek = 'tuesday';
      const startTime = convertToMinutes('05:00 PM');
      const endTime = convertToMinutes('04:00 PM');
      expect(checkForOverlap(dayOfWeek, startTime, endTime, entries)).toBe(true);
    });
  });

  describe('convertToMinutes', () => {
    test('should convert time string to minutes correctly', () => {
      const timeString = '02:30 PM';
      expect(convertToMinutes(timeString)).toBe(870);
    });

    test('should handle time string in 12-hour format', () => {
      const timeString = '09:15 AM';
      expect(convertToMinutes(timeString)).toBe(555);
    });

    test('should handle time string in 24-hour format', () => {
      const timeString = '18:45';
      expect(convertToMinutes(timeString)).toBe(1125);
    });

    test('should handle midnight (12:00 AM)', () => {
      const timeString = '12:00 AM';
      expect(convertToMinutes(timeString)).toBe(0);
    });

    test('should handle noon (12:00 PM)', () => {
      const timeString = '12:00 PM';
      expect(convertToMinutes(timeString)).toBe(720);
    });
  });
});
