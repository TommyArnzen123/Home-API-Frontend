export interface IError {
  message: string;
  errorCode: string;
}

export interface IErrorMessage {
  message: string;
}

export interface IErrorWithMessage {
  error: IErrorMessage;
}
