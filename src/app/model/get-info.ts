export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface IHome {
  userId: number;
  homeId: number;
  homeName: string;
  totalLocations: number;
  totalDevices: number;
}

export interface ILocation {
  homeId: number;
  locationId: number;
  locationName: string;
  devices: IDevice[];
}

export interface IDevice {
  locationId: number;
  deviceId: number;
  deviceName: string;
  temperature: ITemperature;
}

export interface ITemperature {
  temperatureId: number;
  temperature: number;
  dateRecorded: Date;
}

export interface IAverageTemperatureByHour {
  hour: number;
  averageTemperature: number;
  temperatureAvailable?: boolean;
}

export interface IDeviceInformationCurrentDay {
  deviceId: number;
  locationId: number;
  homeId: number;
  deviceName: string;
  mostRecentTemperature: number;
  mostRecentTemperatureAvailable: boolean;
  mostRecentTemperatureAvailableDateTime: string;
  averageTemperaturesByHourCurrentDay: IAverageTemperatureByHour[];
}

export interface IEntityInfoRequest {
  id: number;
  jwtToken: string;
}

export interface IHomeScreenInfoResponse {
  userId: number;
  homes: IHome[];
}

export interface IViewHomeInfoResponse {
  homeId: number;
  homeName: string;
  locations: ILocation[];
}
