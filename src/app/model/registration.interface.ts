export interface IRegisterUserRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
}

export interface IRegisterGenericEntityRequest {
  parentEntityId: number;
  name: string;
}

export interface IRegisterGenericEntityResponse {
  message: String;
}


// TO BE IMPLEMENTED.
export interface IRegisterDeviceRequest {}
export interface IRegisterDeviceResponse {}
