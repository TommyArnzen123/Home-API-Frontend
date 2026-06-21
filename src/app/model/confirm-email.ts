// Email Confirmation Signal Store Interfaces.
export interface IEmailConfirmed {
  isConfirmed: boolean;
  generatedCode?: IEmailConfirmationCode;
}

export interface IEmailConfirmationCode {
  confirmationId: number;
  expiresAt: Date;
  attemptsRemaining: number;
}

// Generate Email Confirmation Code Step.
export enum GenerateEmailConfirmationCodeErrorTypeEnum {
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  EMAIL_ALREADY_CONFIRMED = 'EMAIL_ALREADY_CONFIRMED',
  BAD_REQUEST = 'BAD_REQUEST',
}

export type GenerateEmailConfirmationCodeErrorTypes =
  | 'TOO_MANY_REQUESTS'
  | 'EMAIL_ALREADY_CONFIRMED'
  | 'BAD_REQUEST';

export interface IGenerateEmailConfirmationCodeErrorResponse {
  error: IGenerateEmailConfirmationCodeError;
}

export interface IGenerateEmailConfirmationCodeError {
  errorType: GenerateEmailConfirmationCodeErrorTypes;
  retryAfterSeconds?: number;
}

// Confirm Email Confirmation Code Step.
export enum ConfirmEmailErrorTypes {
  NOT_ACTIVE = 'NOT_ACTIVE',
  ALREADY_CONFIRMED = 'ALREADY_CONFIRMED',
  CODE_EXPIRED = 'CODE_EXPIRED',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
  CODE_MISMATCH = 'CODE_MISMATCH',
  BAD_REQUEST = 'BAD_REQUEST',
}

export interface IConfirmEmailModal {
  emailConfirmationCode: number;
}

export interface IConfirmEmailRequest {
  confirmationId: number;
  userId: number;
  emailConfirmationCode: number;
}

export type ConfirmEmailConfirmationCodeErrorTypes =
  | 'NOT_ACTIVE'
  | 'ALREADY_CONFIRMED'
  | 'CODE_EXPIRED'
  | 'TOO_MANY_ATTEMPTS'
  | 'CODE_MISMATCH'
  | 'BAD_REQUEST';

export type IConfirmEmailError = Partial<IEmailConfirmationCode> & {
  errorType: ConfirmEmailConfirmationCodeErrorTypes;
};

export interface IConfirmEmailConfirmationCodeErrorResponse {
  error: IConfirmEmailError;
}
