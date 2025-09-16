export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface IHome {
  homeId: number;
  userId: number;
  homeName: string;
}

export interface ILocation {
  locationId: number;
  homeId: number;
  locationName: string;
}

export interface IDevice {
  deviceId: number;
  locationId: number;
  deviceName: string;
}

export interface ITemperature {
  temperatureId: number;
  deviceId: number;
  temperature: number;
}

export interface IAverageTemperatureByHour {
  hour: number;
  averageTemperature: number;
  temperatureAvailable?: boolean;
}

export interface IDeviceInformationCurrentDay {
  deviceId: number;
  locationId: number;
  deviceName: string;
  mostRecentTemperature: number;
  mostRecentTemperatureAvailable: boolean;
  mostRecentTemperatureAvailableDateTime: string;
  averageTemperaturesByHourCurrentDay: IAverageTemperatureByHour[];
}
