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
  devices: IDevice[];
}

export interface IDevice {
  deviceId: number;
  locationId: number;
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
  deviceName: string;
  mostRecentTemperature: number;
  mostRecentTemperatureAvailable: boolean;
  mostRecentTemperatureAvailableDateTime: string;
  averageTemperaturesByHourCurrentDay: IAverageTemperatureByHour[];
}
