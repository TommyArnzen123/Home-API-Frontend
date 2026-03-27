export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IUser {
  userId: number;
  firstName: string;
  username: string;
  jwtToken: string;
}
