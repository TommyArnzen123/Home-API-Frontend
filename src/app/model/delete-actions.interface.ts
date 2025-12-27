export interface IDeleteHomeRequest {
    homeId: number;
}

export interface IDeleteHomeResponse {
    homeId: number;
    totalLocations: number;
    totalDevices: number;
}