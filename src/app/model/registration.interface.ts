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
