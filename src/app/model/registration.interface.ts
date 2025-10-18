export interface IRegisterUserRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
}

export interface IRegisterUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
}

export interface IRegisterHomeRequest {
  userId: number;
  homeName: string;
}

export interface IRegisterHomeResponse {
  userId: number;
  homeName: string;
}

// TO BE IMPLEMENTED.
export interface IRegisterLocationRequest {}
export interface IRegisterLocationResponse {}

export interface IRegisterDeviceRequest {}
export interface IRegisterDeviceResponse {}
