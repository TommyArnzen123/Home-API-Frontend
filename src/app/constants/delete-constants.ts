import { IModal } from '../model/modal';

export const DELETE_HOME_SUCCESS_MODAL: IModal = {
  title: 'Deletion Successful',
  content: 'The home was successfully deleted.',
};

export const DELETE_LOCATION_SUCCESS_MODAL: IModal = {
  title: 'Deletion Successful',
  content: 'The location was successfully deleted.',
};

export const DELETE_DEVICE_SUCCESS_MODAL: IModal = {
  title: 'Deletion Successful',
  content: 'The device was successfully deleted.',
  disableClose: true,
};

export const DELETE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL: IModal = {
  title: 'Deletion Successful',
  content: 'The temperature threshold was successfully deleted.',
  disableClose: true,
};
