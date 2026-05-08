import { IDevice } from '../../model/get-info';

export function setAverageTemperature(devices: IDevice[]): number | null {
  let counter = 0;
  let temperature: number | null = null;

  devices.forEach((device) => {
    if (device.temperature) {
      counter++;
      temperature = temperature
        ? temperature + device.temperature.temperature
        : device.temperature.temperature;
    }
  });

  // Return the average temperature.
  // temperature === 0 included explicitly as 0 is considered a falsy value.
  if (counter > 0 && (temperature || temperature === 0)) {
    return temperature / counter;
  }

  // There are no temperature values to use to calculate the average temperature.
  return null;
}

// Check to see if the average temperature is outside the threshold limits.
export function isThresholdViolated(
  averageTemperature: number,
  minThreshold: number | null | undefined,
  maxThreshold: number | null | undefined,
): boolean {
  if (
    (minThreshold && averageTemperature < minThreshold) ||
    (maxThreshold && averageTemperature > maxThreshold)
  ) {
    return true;
  }

  return false;
}
