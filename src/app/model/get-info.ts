import { IBreadcrumb } from '../store/entity.store';
import { ITemperatureThreshold } from './temperature-threshold';

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

export interface ITemperature {
  temperatureId: number;
  temperature: number;
  dateRecorded: Date;
}

export interface IAverageTemperatureByHour {
  hour: number;
  averageTemperature: number | null;
  // temperatureAvailable?: boolean;
}

export interface IEntityInfoRequest {
  id: number;
}

export interface IHomescreenInfoResponse extends EntityPath {
  userId: number;
  emailConfirmed: boolean;
  homes: IHome[];
}

export interface IViewHomeInfoResponse extends EntityPath {
  homeId: number;
  homeName: string;
  locations: ILocationSummary[];
}

export interface EntityPath {
  entityPath: IBreadcrumb[];
}

export interface ILocationSummary {
  homeId: number;
  locationId: number;
  locationName: string;
  numDevices: number;
  averageTemperature: number;
  threshold: ITemperatureThreshold;
}

export interface IViewLocationInfoResponse extends EntityPath {
  homeId: number;
  locationId: number;
  locationName: string;
  devices: IDeviceSummary[];
  threshold: ITemperatureThreshold;
}

export interface IDeviceSummary {
  locationId: number;
  deviceId: number;
  deviceName: string;
  temperature: ITemperature;
}

export interface IViewDeviceInfoResponse extends EntityPath {
  deviceId: number;
  locationId: number;
  homeId: number;
  deviceName: string;
  temperature: ITemperature;
  averageTemperaturesByHourCurrentDay: IAverageTemperatureByHour[];
}
