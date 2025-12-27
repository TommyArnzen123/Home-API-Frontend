import { ILocation } from "./get-info.interface";

export interface IViewHomeInfoRequest {
  homeId: string;
  jwtToken: string;
}

export interface IViewHomeInfoResponse {
  homeName: string;
  locations: ILocation[];
  numDevices: number;
}
