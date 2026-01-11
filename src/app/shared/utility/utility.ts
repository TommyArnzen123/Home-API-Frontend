// Convert 24 hour (military) time value to 12 hour (standard) time value.
export function militaryTimeToStandardTime(militaryTime: number): number {
  if (militaryTime<0 || militaryTime>23) {return -1;}
  else if (militaryTime<=12) {return militaryTime;} //Return 0 for 12 AM, 12 for 12 PM
  return (militaryTime-12);
  }

// Add a degree symbol to a temperature value and a 'C' or 'F'
// depending on the temperature setting.
export function formatTemperature(temperature: number, isFahrenheit: boolean): string {
    const unit = isFahrenheit ? 'F' : 'C';
    return `${temperature} \xB0 ${unit}`;
}

// Convert Fahrenheit to Celsius.
export function fahrenheitToCelsius(tempFahrenheit: number): number {
  // C = (F - 32) / (9/5)
  return ((tempFahrenheit-32)/(9/5));
}
