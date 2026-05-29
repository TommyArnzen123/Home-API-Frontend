import { effect, inject, Injectable } from '@angular/core';
import { EntityActions, EntityStore } from '../store/entity.store';
import { ModalService } from './modal';
import {
  ADD_TEMPERATURE_THRESHOLD_ERROR_MODAL,
  DELETE_DEVICE_ERROR_MODAL,
  DELETE_HOME_ERROR_MODAL,
  DELETE_LOCATION_ERROR_MODAL,
  DELETE_TEMPERATURE_THRESHOLD_ERROR_MODAL,
  REGISTER_DEVICE_ERROR_MODAL,
  REGISTER_HOME_ERROR_MODAL,
  REGISTER_LOCATION_ERROR_MODAL,
  UPDATE_TEMPERATURE_THRESHOLD_ERROR_MODAL,
  VIEW_HOME_GET_INFO_ERROR_MODAL,
  VIEW_LOCATION_GET_INFO_ERROR_MODAL,
} from '../constants/error-constants';
import {
  DELETE_DEVICE_SUCCESS_MODAL,
  DELETE_HOME_SUCCESS_MODAL,
  DELETE_LOCATION_SUCCESS_MODAL,
  DELETE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL,
} from '../constants/delete-constants';
import {
  ADD_TEMPERATURE_THRESHOLD_SUCCESS_MODAL,
  REGISTER_DEVICE_SUCCESS_MODAL,
  REGISTER_HOME_SUCCESS_MODAL,
  REGISTER_LOCATION_SUCCESS_MODAL,
  UPDATE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL,
} from '../constants/success-constants';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly entityStore = inject(EntityStore);
  private readonly modalService = inject(ModalService);
  constructor() {
    this.setSuccessEffects();
    this.setErrorEffects();
  }

  private setSuccessEffects() {
    effect(() => {
      const success: EntityActions = this.entityStore.successNotification();

      if (success === 'register-home') {
        this.modalService.showModalElement(REGISTER_HOME_SUCCESS_MODAL);
      }

      if (success === 'register-location') {
        this.modalService.showModalElement(REGISTER_LOCATION_SUCCESS_MODAL);
      }

      if (success === 'register-device') {
        this.modalService.showModalElement(REGISTER_DEVICE_SUCCESS_MODAL);
      }

      if (success === 'add-temperature-threshold') {
        this.modalService.showModalElement(ADD_TEMPERATURE_THRESHOLD_SUCCESS_MODAL);
      }

      if (success === 'update-temperature-threshold') {
        this.modalService.showModalElement(UPDATE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL);
      }

      if (success === 'delete-temperature-threshold') {
        this.modalService.showModalElement(DELETE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL);
      }

      if (success === 'delete-home') {
        this.modalService.showModalElement(DELETE_HOME_SUCCESS_MODAL);
      }

      if (success === 'delete-location') {
        this.modalService.showModalElement(DELETE_LOCATION_SUCCESS_MODAL);
      }

      if (success === 'delete-device') {
        this.modalService.showModalElement(DELETE_DEVICE_SUCCESS_MODAL);
      }
    });
  }

  private setErrorEffects() {
    effect(() => {
      const error: EntityActions = this.entityStore.errorNotification();

      if (error === 'get-view-home-info') {
        this.modalService.showModalElement(VIEW_HOME_GET_INFO_ERROR_MODAL);
      }

      if (error === 'get-view-location-info') {
        this.modalService.showModalElement(VIEW_LOCATION_GET_INFO_ERROR_MODAL);
      }

      if (error === 'register-home') {
        this.modalService.showModalElement(REGISTER_HOME_ERROR_MODAL);
      }

      if (error === 'register-location') {
        this.modalService.showModalElement(REGISTER_LOCATION_ERROR_MODAL);
      }

      if (error === 'register-device') {
        this.modalService.showModalElement(REGISTER_DEVICE_ERROR_MODAL);
      }

      if (error === 'add-temperature-threshold') {
        this.modalService.showModalElement(ADD_TEMPERATURE_THRESHOLD_ERROR_MODAL);
      }

      if (error === 'update-temperature-threshold') {
        this.modalService.showModalElement(UPDATE_TEMPERATURE_THRESHOLD_ERROR_MODAL);
      }

      if (error === 'delete-temperature-threshold') {
        this.modalService.showModalElement(DELETE_TEMPERATURE_THRESHOLD_ERROR_MODAL);
      }

      if (error === 'delete-home') {
        this.modalService.showModalElement(DELETE_HOME_ERROR_MODAL);
      }

      if (error === 'delete-location') {
        this.modalService.showModalElement(DELETE_LOCATION_ERROR_MODAL);
      }

      if (error === 'delete-device') {
        this.modalService.showModalElement(DELETE_DEVICE_ERROR_MODAL);
      }
    });
  }
}
