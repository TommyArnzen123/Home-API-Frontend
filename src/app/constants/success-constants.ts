import { IModal } from '../model/modal';

export const REGISTER_USER_SUCCESS_MODAL: IModal = {
  title: 'Registration Successful',
  content: 'You can now login to your account.',
};

export const REGISTER_HOME_SUCCESS_MODAL: IModal = {
  title: 'Home Added',
  content: 'Your new home has been registered.',
};

export const REGISTER_LOCATION_SUCCESS_MODAL: IModal = {
  title: 'Location Added',
  content: 'Your new location has been registered.',
};

export const REGISTER_DEVICE_SUCCESS_MODAL: IModal = {
  title: 'Device Added',
  content: 'Your new device has been registered.',
};

export const ADD_TEMPERATURE_THRESHOLD_SUCCESS_MODAL: IModal = {
  title: 'Threshold Added',
  content: 'The temperature threshold has been added.',
  disableClose: true,
};

export const UPDATE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL: IModal = {
  title: 'Threshold Updated',
  content: 'The temperature threshold has been updated.',
  disableClose: true,
};
