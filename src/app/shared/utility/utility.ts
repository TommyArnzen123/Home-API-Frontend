import { IHome } from '../../model/get-info';

// Convert 24 hour (military) time value to 12 hour (standard) time value.
export function militaryTimeToStandardTime(militaryTime: number): number {
  return 0;
}

// Add a degree symbol to a temperature value and a 'C' or 'F'
// depending on the temperature setting.
export function formatTemperature(temperature: number, isFahrenheit: boolean): string {
  return '';
}

// Convert Fahrenheit to Celsius.
export function fahrenheitToCelsius(tempFahrenheit: number): number {
  return 0;
}

export function setHomescreenGreetingMessage(userFirstName: string): string {
  // Get the current hour.
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  // Set a default message.
  let message = ('Hello ' + userFirstName).trim() + '!';

  if (currentHour >= 0 && currentHour <= 11) {
    message = ('Good Morning ' + userFirstName).trim() + '!';
  } else if (currentHour >= 12 && currentHour <= 16) {
    message = ('Good Afternoon ' + userFirstName).trim() + '!';
  } else {
    message = ('Good Evening ' + userFirstName).trim() + '!';
  }

  return message;
}

export function formatName(name: string | null): string {
  if (!name) return '';

  let formattedName = name.toLowerCase();
  formattedName = formattedName.charAt(0).toUpperCase() + formattedName.substring(1);
  return formattedName;
}
