import { IDeviceSummary } from '../../model/get-info';
import { DeviceData } from '../../store/entity.store';

// Check usage - Can possibly be deleted.
export function setAverageTemperature(devices: DeviceData[]): number | null {
  let counter = 0;
  let temperature: number | null = null;

  devices.forEach((device) => {
    if (device.summary && device.summary.temperature) {
      counter++;
      temperature = temperature
        ? temperature + device.summary.temperature.temperature
        : device.summary.temperature.temperature;
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
  minThreshold: number | undefined,
  maxThreshold: number | undefined,
): boolean {
  if (
    (minThreshold && averageTemperature < minThreshold) ||
    (maxThreshold && averageTemperature > maxThreshold)
  ) {
    return true;
  }

  return false;
}
