import { formatTemperature, militaryTimeToStandardTime, fahrenheitToCelsius} from './utility';
/*
describe('Utility Methods', () => {
  it('should return an empty string from the formatTemperature method.', () => {
    expect(formatTemperature(0, true)).toEqual('');
  });
});
*/

describe('Utility Methods', () => {
  // ------------------------------
  // militaryTimeToStandardTime
  // ------------------------------
  describe('militaryTimeToStandardTime', () => {
    it('returns -1 for invalid inputs (x<0, 23<x)', () => {
      expect(militaryTimeToStandardTime(-1)).toBe(-1);
      expect(militaryTimeToStandardTime(24)).toBe(-1);
      expect(militaryTimeToStandardTime(100)).toBe(-1);
    });

    it('formats AM correctly (0-12 stay same)', () => {
      expect(militaryTimeToStandardTime(0)).toBe(0);    // 12 AM
      expect(militaryTimeToStandardTime(1)).toBe(1);
      expect(militaryTimeToStandardTime(2)).toBe(2);
      expect(militaryTimeToStandardTime(12)).toBe(12);
    });

    it('formats PM correctly (13–23 -> subtract 12)', () => {
      expect(militaryTimeToStandardTime(13)).toBe(1);
      expect(militaryTimeToStandardTime(20)).toBe(8);
      expect(militaryTimeToStandardTime(22)).toBe(10);
      expect(militaryTimeToStandardTime(23)).toBe(11);
    });
  });

  // ------------------------------
  // formatTemperature
  // ------------------------------
  describe('formatTemperature', () => {
    it('formats Fahrenheit and Celsius based on boolean flag', () => {
      expect(formatTemperature(10, true)).toBe('10 \xB0 F');
      expect(formatTemperature(13, false)).toBe('13 \xB0 C');
    });
  });

  // ------------------------------
  // fahrenheitToCelsius
  // ------------------------------
  describe('fahrenheitToCelsius', () => {
    it('converts correctly using your formula', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
      expect(fahrenheitToCelsius(50)).toBeCloseTo(10);   // ~10
      expect(fahrenheitToCelsius(68)).toBeCloseTo(20);   // ~20
      expect(fahrenheitToCelsius(77)).toBeCloseTo(25);   // ~25
    });
  });
});
