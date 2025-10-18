export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IUser {
  userId: string;
  firstName: string;
  username: string;
  jwtToken: string;
}
