import { IAccountSettings } from './account-settings';

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IUserInfo {
  userId: number;
  firstName: string;
  // username: string;
}

export interface ILoginInfo {
  userInfo: IUserInfo;
  jwtToken: string;
  accountSettings: IAccountSettings;
}
