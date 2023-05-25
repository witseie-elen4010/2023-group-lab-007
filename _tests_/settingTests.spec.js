const { checkForOverlap, convertToMinutes, convertTo24 } = require('../public/scripts/services/settings_service');

describe('periodEvaluation', () => {
  describe('checkForOverlap', () => {
    let entries;

    beforeEach(() => {
      entries = [
        { dayOfWeek: 'monday', startTime: '10:00', endTime: '12:00' },
        { dayOfWeek: 'tuesday', startTime: '14:00', endTime: '16:00' },
      ];
    });

    test('should return false for a non-overlapping period', () => {
      const dayOfWeek = 'wednesday';
      const startTime = convertToMinutes('13:00');
      const endTime = convertToMinutes('15:00');
      expect(checkForOverlap(dayOfWeek, startTime, endTime, entries)).toBe(false);
    });

    test('should return true for an overlapping period', () => {
      const dayOfWeek = 'tuesday';
      const startTime = convertToMinutes('18:00');
      const endTime = convertToMinutes('16:00');
      expect(checkForOverlap(dayOfWeek, startTime, endTime, entries)).toBe(true);
    });

    test('should return true for start time after end time', () => {
      const dayOfWeek = 'tuesday';
      const startTime = convertToMinutes('18:00');
      const endTime = convertToMinutes('16:00');
      expect(checkForOverlap(dayOfWeek, startTime, endTime, entries)).toBe(true);
    });
  });

  describe('convertToMinutes', () => {
    test('should convert time string to minutes correctly', () => {
      const timeString = '14:30';
      expect(convertToMinutes(timeString)).toBe(870);
    });

    test('should handle time string in 12-hour format', () => {
      const timeString = '09:15';
      expect(convertToMinutes(timeString)).toBe(555);
    });

    test('should handle time string in 24-hour format', () => {
      const timeString = '18:45';
      expect(convertToMinutes(timeString)).toBe(1125);
    });

    test('should handle midnight (12:00 AM)', () => {
      const timeString = '00:00';
      expect(convertToMinutes(timeString)).toBe(0);
    });

    test('should handle noon (12:00 PM)', () => {
      const timeString = '12:00';
      expect(convertToMinutes(timeString)).toBe(720);
    });
  });
});
