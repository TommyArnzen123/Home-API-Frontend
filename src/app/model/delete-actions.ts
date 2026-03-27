// Generic delete entity interface used for homes, locations, and devices.
export interface IDeleteEntityRequest {
  id: number;
}

export interface IDeleteHomeResponse {
  homeId: number;
  numLocations: number;
  numDevices: number;
}

export interface IDeleteLocationResponse {
  locationId: number;
  numDevices: number;
  homeId: number;
}

export interface IDeleteDeviceResponse {
  deviceId: number;
  locationId: number;
}
