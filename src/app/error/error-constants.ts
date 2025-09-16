import { IModal } from '../model/modal.interface';

export const DELETE_DEVICE_BY_ID_ERROR: IModal = {
  title: 'Something Went Wrong',
  content: 'There was an error in the network call to delete the device. Please try again.',
};

export const GET_DEVICE_INFORMATION_BY_DEVICE_ID: IModal = {
  title: 'Something Went Wrong',
  content: 'There was an error in the network call to get the device information.',
};
