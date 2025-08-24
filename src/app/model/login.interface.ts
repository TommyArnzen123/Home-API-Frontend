export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  userId: string;
  firstName: string;
  username: string;
  jwtToken: string;
}
