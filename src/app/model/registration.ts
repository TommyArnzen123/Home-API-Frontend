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
