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
  message: 'There was an error viewing the selected home.',
  errorCode: '0009',
};

const INVALID_LOCATION_ID_ERROR: IError = {
  message: 'The location ID provided was invalid.',
  errorCode: '0010',
};

const VIEW_LOCATION_GET_INFO_ERROR: IError = {
  message: 'There was an error viewing the selected location.',
  errorCode: '0011',
};

const VIEW_DEVICE_INVALID_DEVICE_ID_ERROR: IError = {
  message: 'The device ID provided was invalid.',
  errorCode: '0012',
};

const VIEW_DEVICE_GET_INFO_ERROR: IError = {
  message: 'There was an error viewing the selected device.',
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

export const VIEW_DEVICE_INVALID_DEVICE_ID_ERROR_MODAL: IModal = {
  title: 'Something Went Wrong...',
  content: VIEW_DEVICE_INVALID_DEVICE_ID_ERROR.message,
  footer: 'Error Code: ' + VIEW_DEVICE_INVALID_DEVICE_ID_ERROR.errorCode,
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
