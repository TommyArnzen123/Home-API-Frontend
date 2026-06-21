import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Verify the value entered is a valid number.
export function numericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === '') {
      return null;
    }

    // Check if the value is a number.
    const isNumber = !isNaN(parseFloat(value)) && isFinite(value);

    return isNumber ? null : { numberViolation: true };
  };
}

// // Verify the minimum value is not greater than the maximum value.
// // NOTE: Both the minimum value and the maximum value should be set for this check to take place.
// export function minMaxValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const minTemp = control.get('minimumTemperature')?.value;
//     const maxTemp = control.get('maximumTemperature')?.value;

//     if (!minTemp || !maxTemp) {
//       return null; // One or both values are not set.
//     }

//     const isMinTempNumber = !isNaN(parseFloat(minTemp)) && isFinite(minTemp);
//     const isMaxTempNumber = !isNaN(parseFloat(maxTemp)) && isFinite(maxTemp);

//     if (isMinTempNumber && isMaxTempNumber && Number(minTemp) > Number(maxTemp)) {
//       return { minMaxTempViolation: true }; // Both values are set and minTemp > maxTemp.
//     }

//     return null; // Both values are set and minTemp < maxTemp.
//   };
// }

// // Verify at least one value was entered (minimum temp and/or maximum temp).
// export function valueEnteredValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const minTemp = control.get('minimumTemperature')?.value;
//     const maxTemp = control.get('maximumTemperature')?.value;

//     if (!minTemp && !maxTemp) {
//       return { noValueEnteredViolation: true }; // No value entered.
//     }

//     return null; // At least one value entered.
//   };
// }

// // In the Update Flow: Verify at least one value was updated.
// export function updatedValueValidator(
//   flow: TemperatureThresholdModalFlow,
//   originalMinTemp: number | undefined,
//   originalMaxTemp: number | undefined,
// ): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     if (flow === 'add-temperature-threshold') {
//       return null; // This check is only run in the 'update-temperature-threshold' flow.
//     }

//     const minTemp = control.get('minimumTemperature')?.value;
//     const maxTemp = control.get('maximumTemperature')?.value;

//     let minTempUpdated = false;
//     let maxTempUpdated = false;

//     if (minTemp && minTemp !== originalMinTemp) {
//       minTempUpdated = true;
//     }

//     if (maxTemp && maxTemp !== originalMaxTemp) {
//       maxTempUpdated = true;
//     }

//     if (minTempUpdated || maxTempUpdated) {
//       return null;
//     } else {
//       return { noValueUpdatedViolation: true };
//     }
//   };
// }
