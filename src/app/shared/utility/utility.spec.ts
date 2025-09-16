import { formatTemperature } from './utility';

describe('Utility Methods', () => {
  it('should return an empty string from the formatTemperature method.', () => {
    expect(formatTemperature()).toEqual('');
  });
});
