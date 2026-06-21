import { IError } from '../model/error';
import { IModal } from '../model/modal';

// Error Objects.
const REGISTER_USER_ERROR: IError = {
  message: 'There was an error registering the user.',
  errorCode: '0001',
};

const REGISTER_HOME_ERROR: IError = {
  message: 'There was an error registering the home.',
  errorCode: '0002',
};

const REGISTER_LOCATION_ERROR: IError = {
  message: 'There was an error registering the location.',
  errorCode: '0003',
};

const REGISTER_DEVICE_ERROR: IError = {
  message: 'There was an error registering the device.',
  errorCode: '0004',
};

const DELETE_HOME_ERROR: IError = {
  message: 'There was an error deleting the home.',
  errorCode: '0005',
};

const DELETE_LOCATION_ERROR: IError = {
  message: 'There was an error deleting the location.',
  errorCode: '0006',
};

const DELETE_DEVICE_ERROR: IError = {
  message: 'There was an error deleting the device.',
  errorCode: '0007',
};

const INVALID_HOME_ID_ERROR: IError = {
  message: 'The home ID provided was invalid.',
  errorCode: '0008',
};

const VIEW_HOME_GET_INFO_ERROR: IError = {
  message: 'There was an error getting information for the selected home.',
  errorCode: '0009',
};

const INVALID_LOCATION_ID_ERROR: IError = {
  message: 'The location ID provided was invalid.',
  errorCode: '0010',
};

const VIEW_LOCATION_GET_INFO_ERROR: IError = {
  message: 'There was an error getting information for the selected location.',
  errorCode: '0011',
};

const INVALID_DEVICE_ID_ERROR: IError = {
  message: 'The device ID provided was invalid.',
  errorCode: '0012',
};

const VIEW_DEVICE_GET_INFO_ERROR: IError = {
  message: 'There was an error getting information for the selected device.',
  errorCode: '0013',
};

const ADD_TEMPERATURE_THRESHOLD_ERROR: IError = {
  message: 'There was an error adding the temperature threshold.',
  errorCode: '0014',
};

const UPDATE_TEMPERATURE_THRESHOLD_ERROR: IError = {
  message: 'There was an error updating the temperature threshold.',
  errorCode: '0015',
};

const DELETE_TEMPERATURE_THRESHOLD_ERROR: IError = {
  message: 'There was an error deleting the temperature threshold.',
  errorCode: '0016',
};

const EDIT_HOME_ERROR: IError = {
  message: 'There was an error editing the home information.',
  errorCode: '0017',
};

const EDIT_LOCATION_ERROR: IError = {
  message: 'There was an error editing the location information.',
  errorCode: '0018',
};

const EDIT_DEVICE_ERROR: IError = {
  message: 'There was an error editing the device information.',
  errorCode: '0019',
};

const GENERATE_EMAIL_CONFIRMATION_CODE_TOO_MANY_REQUESTS_ERROR: IError = {
  message: 'You have made too many code generation requests. Please try again soon.',
  errorCode: '0020',
};

const GENERATE_EMAIL_CONFIRMATION_CODE_EMAIL_ALREADY_CONFIRMED_ERROR: IError = {
  message: 'Your email address is already confirmed.',
  errorCode: '0021',
};

const GENERATE_EMAIL_CONFIRMATION_CODE_BAD_REQUEST_ERROR: IError = {
  message: 'There was an error generating the email confirmation code. Please try again.',
  errorCode: '0022',
};

const CONFIRM_EMAIL_CODE_NOT_ACTIVE_ERROR: IError = {
  message: 'The email confirmation code is not active. Please generate a new code.',
  errorCode: '0024',
};

const CONFIRM_EMAIL_CODE_ALREADY_CONFIRMED_ERROR: IError = {
  message: 'The email confirmation code is already confirmed. No further action is needed.',
  errorCode: '0025',
};

const CONFIRM_EMAIL_CODE_EXPIRED_CODE_ERROR: IError = {
  message:
    'The email confirmation code has expired. Confirmation codes must be entered within five minutes of their creation. Please generate a new code.',
  errorCode: '0026',
};

const CONFIRM_EMAIL_CODE_TOO_MANY_ATTEMPTS_ERROR: IError = {
  message:
    'You have reached the maximum number of confirmation attempts (5). Please generate a new code.',
  errorCode: '0027',
};

const CONFIRM_EMAIL_CODE_BAD_REQUEST_ERROR: IError = {
  message: 'There was an error confirming your email. Please generate a new code.',
  errorCode: '0028',
};

// Error Modal Objects.
export const REGISTER_USER_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: REGISTER_USER_ERROR.message,
  footer: 'Error Code: ' + REGISTER_USER_ERROR.errorCode,
};

export const REGISTER_HOME_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: REGISTER_HOME_ERROR.message,
  footer: 'Error Code: ' + REGISTER_HOME_ERROR.errorCode,
};

export const REGISTER_LOCATION_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: REGISTER_LOCATION_ERROR.message,
  footer: 'Error Code: ' + REGISTER_LOCATION_ERROR.errorCode,
};

export const REGISTER_DEVICE_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: REGISTER_DEVICE_ERROR.message,
  footer: 'Error Code: ' + REGISTER_DEVICE_ERROR.errorCode,
};

export const DELETE_HOME_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: DELETE_HOME_ERROR.message,
  footer: 'Error Code: ' + DELETE_HOME_ERROR.errorCode,
};

export const DELETE_LOCATION_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: DELETE_LOCATION_ERROR.message,
  footer: 'Error Code: ' + DELETE_LOCATION_ERROR.errorCode,
};

export const DELETE_DEVICE_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: DELETE_DEVICE_ERROR.message,
  footer: 'Error Code: ' + DELETE_DEVICE_ERROR.errorCode,
};

export const INVALID_HOME_ID_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: INVALID_HOME_ID_ERROR.message,
  footer: 'Error Code: ' + INVALID_HOME_ID_ERROR.errorCode,
  disableClose: true,
};

export const VIEW_HOME_GET_INFO_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: VIEW_HOME_GET_INFO_ERROR.message,
  footer: 'Error Code: ' + VIEW_HOME_GET_INFO_ERROR.errorCode,
  disableClose: true,
};

export const INVALID_LOCATION_ID_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: INVALID_LOCATION_ID_ERROR.message,
  footer: 'Error Code: ' + INVALID_LOCATION_ID_ERROR.errorCode,
  disableClose: true,
};

export const VIEW_LOCATION_GET_INFO_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: VIEW_LOCATION_GET_INFO_ERROR.message,
  footer: 'Error Code: ' + VIEW_LOCATION_GET_INFO_ERROR.errorCode,
  disableClose: true,
};

export const INVALID_DEVICE_ID_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: INVALID_DEVICE_ID_ERROR.message,
  footer: 'Error Code: ' + INVALID_DEVICE_ID_ERROR.errorCode,
  disableClose: true,
};

export const VIEW_DEVICE_GET_INFO_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: VIEW_DEVICE_GET_INFO_ERROR.message,
  footer: 'Error Code: ' + VIEW_DEVICE_GET_INFO_ERROR.errorCode,
  disableClose: true,
};

export const ADD_TEMPERATURE_THRESHOLD_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: ADD_TEMPERATURE_THRESHOLD_ERROR.message,
  footer: 'Error Code: ' + ADD_TEMPERATURE_THRESHOLD_ERROR.errorCode,
  disableClose: true,
};

export const UPDATE_TEMPERATURE_THRESHOLD_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: UPDATE_TEMPERATURE_THRESHOLD_ERROR.message,
  footer: 'Error Code: ' + UPDATE_TEMPERATURE_THRESHOLD_ERROR.errorCode,
  disableClose: true,
};

export const DELETE_TEMPERATURE_THRESHOLD_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: DELETE_TEMPERATURE_THRESHOLD_ERROR.message,
  footer: 'Error Code: ' + DELETE_TEMPERATURE_THRESHOLD_ERROR.errorCode,
  disableClose: true,
};

export const EDIT_HOME_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: EDIT_HOME_ERROR.message,
  footer: 'Error Code: ' + EDIT_HOME_ERROR.errorCode,
  disableClose: true,
};

export const EDIT_LOCATION_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: EDIT_LOCATION_ERROR.message,
  footer: 'Error Code: ' + EDIT_LOCATION_ERROR.errorCode,
  disableClose: true,
};

export const EDIT_DEVICE_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: EDIT_DEVICE_ERROR.message,
  footer: 'Error Code: ' + EDIT_DEVICE_ERROR.errorCode,
  disableClose: true,
};

export const GENERATE_EMAIL_CONFIRMATION_CODE_TOO_MANY_REQUESTS_ERROR_MODAL: IModal = {
  title: 'Too Many Requests',
  content: GENERATE_EMAIL_CONFIRMATION_CODE_TOO_MANY_REQUESTS_ERROR.message,
  footer: 'Error Code: ' + GENERATE_EMAIL_CONFIRMATION_CODE_TOO_MANY_REQUESTS_ERROR.errorCode,
  disableClose: true,
};

export const GENERATE_EMAIL_CONFIRMATION_CODE_EMAIL_ALREADY_CONFIRMED_ERROR_MODAL: IModal = {
  title: 'Email Already Confirmed',
  content: GENERATE_EMAIL_CONFIRMATION_CODE_EMAIL_ALREADY_CONFIRMED_ERROR.message,
  footer: 'Error Code: ' + GENERATE_EMAIL_CONFIRMATION_CODE_EMAIL_ALREADY_CONFIRMED_ERROR.errorCode,
  disableClose: true,
};

export const GENERATE_EMAIL_CONFIRMATION_CODE_BAD_REQUEST_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: GENERATE_EMAIL_CONFIRMATION_CODE_BAD_REQUEST_ERROR.message,
  footer: 'Error Code: ' + GENERATE_EMAIL_CONFIRMATION_CODE_BAD_REQUEST_ERROR.errorCode,
  disableClose: true,
};

export const CONFIRM_EMAIL_CODE_NOT_ACTIVE_ERROR_MODAL: IModal = {
  title: 'Confirmation Code Not Active',
  content: CONFIRM_EMAIL_CODE_NOT_ACTIVE_ERROR.message,
  footer: 'Error Code: ' + CONFIRM_EMAIL_CODE_NOT_ACTIVE_ERROR.errorCode,
  disableClose: true,
};

export const CONFIRM_EMAIL_CODE_ALREADY_CONFIRMED_ERROR_MODAL: IModal = {
  title: 'Confirmation Code Already Confirmed',
  content: CONFIRM_EMAIL_CODE_ALREADY_CONFIRMED_ERROR.message,
  footer: 'Error Code: ' + CONFIRM_EMAIL_CODE_ALREADY_CONFIRMED_ERROR.errorCode,
  disableClose: true,
};

export const CONFIRM_EMAIL_CODE_EXPIRED_CODE_ERROR_MODAL: IModal = {
  title: 'Confirmation Code Expired',
  content: CONFIRM_EMAIL_CODE_EXPIRED_CODE_ERROR.message,
  footer: 'Error Code: ' + CONFIRM_EMAIL_CODE_EXPIRED_CODE_ERROR.errorCode,
  disableClose: true,
};

export const CONFIRM_EMAIL_CODE_TOO_MANY_ATTEMPTS_ERROR_MODAL: IModal = {
  title: 'Too Many Attempts',
  content: CONFIRM_EMAIL_CODE_TOO_MANY_ATTEMPTS_ERROR.message,
  footer: 'Error Code: ' + CONFIRM_EMAIL_CODE_TOO_MANY_ATTEMPTS_ERROR.errorCode,
  disableClose: true,
};

export const CONFIRM_EMAIL_CODE_BAD_REQUEST_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: CONFIRM_EMAIL_CODE_BAD_REQUEST_ERROR.message,
  footer: 'Error Code: ' + CONFIRM_EMAIL_CODE_BAD_REQUEST_ERROR.errorCode,
  disableClose: true,
};
