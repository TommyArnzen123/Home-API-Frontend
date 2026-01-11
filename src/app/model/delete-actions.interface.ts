export interface IDeleteHomeRequest {
    homeId: number;
}

export interface IDeleteHomeResponse {
    homeId: number;
    numLocations: number;
    numDevices: number;
}

export interface IDeleteLocationRequest {
    locationId: number;
}

export interface IDeleteLocationResponse {
    locationId: number;
    numDevices: number;
    homeId: number;
}

export interface IDeleteDeviceRequest {
    deviceId: number;
}

export interface IDeleteDeviceResponse {
    deviceId: number;
    locationId: number;
}