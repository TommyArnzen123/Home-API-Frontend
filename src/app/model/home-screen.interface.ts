import { IHome } from './get-info.interface';

export interface IHomeScreenInfoRequest {
  userId: string;
  jwtToken: string;
}

export interface IHomeScreenInfoResponse {
  userId: string;
  homes: IHome[];
  numLocations: number;
  numDevices: number;
}
