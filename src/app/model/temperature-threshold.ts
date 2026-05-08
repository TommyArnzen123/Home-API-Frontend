export interface ITemperatureThreshold {
  id?: number;
  minimumTemperature: number | undefined;
  maximumTemperature: number | undefined;
  locationId: number;
}

// export interface ITemperatureThresholdRequest extends ITemperatureThreshold {
//   jwtToken: string;
// }

export interface IDeleteTemperatureThresholdRequest {
  thresholdId: number;
  jwtToken: string;
}
