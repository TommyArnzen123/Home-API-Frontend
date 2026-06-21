import { effect, inject, Injectable } from '@angular/core';
import { EntityActions, EntityStore, ErrorState } from '../store/entity.store';
import { ModalService } from './modal';
import {
  ADD_TEMPERATURE_THRESHOLD_ERROR_MODAL,
  CONFIRM_EMAIL_CODE_ALREADY_CONFIRMED_ERROR_MODAL,
  CONFIRM_EMAIL_CODE_BAD_REQUEST_ERROR_MODAL,
  CONFIRM_EMAIL_CODE_EXPIRED_CODE_ERROR_MODAL,
  CONFIRM_EMAIL_CODE_NOT_ACTIVE_ERROR_MODAL,
  CONFIRM_EMAIL_CODE_TOO_MANY_ATTEMPTS_ERROR_MODAL,
  DELETE_DEVICE_ERROR_MODAL,
  DELETE_HOME_ERROR_MODAL,
  DELETE_LOCATION_ERROR_MODAL,
  DELETE_TEMPERATURE_THRESHOLD_ERROR_MODAL,
  EDIT_DEVICE_ERROR_MODAL,
  EDIT_HOME_ERROR_MODAL,
  EDIT_LOCATION_ERROR_MODAL,
  GENERATE_EMAIL_CONFIRMATION_CODE_BAD_REQUEST_ERROR_MODAL,
  GENERATE_EMAIL_CONFIRMATION_CODE_EMAIL_ALREADY_CONFIRMED_ERROR_MODAL,
  GENERATE_EMAIL_CONFIRMATION_CODE_TOO_MANY_REQUESTS_ERROR_MODAL,
  REGISTER_DEVICE_ERROR_MODAL,
  REGISTER_HOME_ERROR_MODAL,
  REGISTER_LOCATION_ERROR_MODAL,
  UPDATE_TEMPERATURE_THRESHOLD_ERROR_MODAL,
  VIEW_DEVICE_GET_INFO_ERROR_MODAL,
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
  EDIT_DEVICE_SUCCESS_MODAL,
  EDIT_HOME_SUCCESS_MODAL,
  EDIT_LOCATION_SUCCESS_MODAL,
  EMAIL_ADDRESS_CONFIRMATION_SUCCESS_MODAL,
  REGISTER_DEVICE_SUCCESS_MODAL,
  REGISTER_HOME_SUCCESS_MODAL,
  REGISTER_LOCATION_SUCCESS_MODAL,
  UPDATE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL,
} from '../constants/success-constants';
import { ConfirmEmailErrorTypes } from '../model/confirm-email';

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

      if (success === 'confirm-email') {
        this.modalService.showModalElement(EMAIL_ADDRESS_CONFIRMATION_SUCCESS_MODAL);
      }

      if (success === 'edit-home') {
        this.modalService.showModalElement(EDIT_HOME_SUCCESS_MODAL);
      }

      if (success === 'edit-location') {
        this.modalService.showModalElement(EDIT_LOCATION_SUCCESS_MODAL);
      }

      if (success === 'edit-device') {
        this.modalService.showModalElement(EDIT_DEVICE_SUCCESS_MODAL);
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
      const error: ErrorState | null = this.entityStore.errorNotification();

      if (error?.errorAction === 'get-view-home-info') {
        this.modalService.showModalElement(VIEW_HOME_GET_INFO_ERROR_MODAL);
      }

      if (error?.errorAction === 'get-view-location-info') {
        this.modalService.showModalElement(VIEW_LOCATION_GET_INFO_ERROR_MODAL);
      }

      if (error?.errorAction === 'get-view-device-info') {
        this.modalService.showModalElement(VIEW_DEVICE_GET_INFO_ERROR_MODAL);
      }

      if (error?.errorAction === 'register-home') {
        this.modalService.showModalElement(REGISTER_HOME_ERROR_MODAL);
      }

      if (error?.errorAction === 'register-location') {
        this.modalService.showModalElement(REGISTER_LOCATION_ERROR_MODAL);
      }

      if (error?.errorAction === 'register-device') {
        this.modalService.showModalElement(REGISTER_DEVICE_ERROR_MODAL);
      }

      // Display the appropriate error modal for the generate email confirmation code error use-case.
      if (error?.errorAction === 'generate-email-confirmation-code') {
        if (error?.errorData?.errorType === 'EMAIL_ALREADY_CONFIRMED') {
          this.modalService.showModalElement(
            GENERATE_EMAIL_CONFIRMATION_CODE_EMAIL_ALREADY_CONFIRMED_ERROR_MODAL,
          );
        } else if (error?.errorData?.errorType === 'TOO_MANY_REQUESTS') {
          const secondsIn30Minutes = 1800;
          const retryAfterSeconds = error?.errorData?.retryAfterSeconds;
          const minutesUntilRetry = this.getMinutesFromSeconds(
            retryAfterSeconds ?? secondsIn30Minutes,
          );
          const tooManyRequestsErrorModal =
            GENERATE_EMAIL_CONFIRMATION_CODE_TOO_MANY_REQUESTS_ERROR_MODAL;
          tooManyRequestsErrorModal.content =
            'There have been too many requests made in the past 30 minutes.' +
            ` Another confirmation code can be generated in ${minutesUntilRetry} ${minutesUntilRetry === 1 ? 'Minute' : 'Minutes'}.`;
          this.modalService.showModalElement(tooManyRequestsErrorModal);
        } else {
          this.modalService.showModalElement(
            GENERATE_EMAIL_CONFIRMATION_CODE_BAD_REQUEST_ERROR_MODAL,
          );
        }
      }

      // Display the appropriate error modal for the confirm email use-case.
      // Different use-cases associated with email confirmation have different error modals.
      if (error?.errorAction === 'confirm-email') {
        if (error?.errorData?.errorType === ConfirmEmailErrorTypes.NOT_ACTIVE) {
          // Display the not active error modal.
          this.modalService.showModalElement(CONFIRM_EMAIL_CODE_NOT_ACTIVE_ERROR_MODAL);
        } else if (error?.errorData?.errorType === ConfirmEmailErrorTypes.ALREADY_CONFIRMED) {
          // Display the already confirmed error modal.
          this.modalService.showModalElement(CONFIRM_EMAIL_CODE_ALREADY_CONFIRMED_ERROR_MODAL);
        } else if (error?.errorData?.errorType === ConfirmEmailErrorTypes.CODE_EXPIRED) {
          // Display the code expired error modal.
          this.modalService.showModalElement(CONFIRM_EMAIL_CODE_EXPIRED_CODE_ERROR_MODAL);
        } else if (error?.errorData?.errorType === ConfirmEmailErrorTypes.TOO_MANY_ATTEMPTS) {
          // Display the too many attempts error modal.
          this.modalService.showModalElement(CONFIRM_EMAIL_CODE_TOO_MANY_ATTEMPTS_ERROR_MODAL);
        } else {
          if (error?.errorData?.errorType !== ConfirmEmailErrorTypes.CODE_MISMATCH) {
            // Display the bad request generic error modal.
            this.modalService.showModalElement(CONFIRM_EMAIL_CODE_BAD_REQUEST_ERROR_MODAL);
          }
        }
      }

      if (error?.errorAction === 'edit-home') {
        this.modalService.showModalElement(EDIT_HOME_ERROR_MODAL);
      }

      if (error?.errorAction === 'edit-location') {
        this.modalService.showModalElement(EDIT_LOCATION_ERROR_MODAL);
      }

      if (error?.errorAction === 'edit-device') {
        this.modalService.showModalElement(EDIT_DEVICE_ERROR_MODAL);
      }

      if (error?.errorAction === 'add-temperature-threshold') {
        this.modalService.showModalElement(ADD_TEMPERATURE_THRESHOLD_ERROR_MODAL);
      }

      if (error?.errorAction === 'update-temperature-threshold') {
        this.modalService.showModalElement(UPDATE_TEMPERATURE_THRESHOLD_ERROR_MODAL);
      }

      if (error?.errorAction === 'delete-temperature-threshold') {
        this.modalService.showModalElement(DELETE_TEMPERATURE_THRESHOLD_ERROR_MODAL);
      }

      if (error?.errorAction === 'delete-home') {
        this.modalService.showModalElement(DELETE_HOME_ERROR_MODAL);
      }

      if (error?.errorAction === 'delete-location') {
        this.modalService.showModalElement(DELETE_LOCATION_ERROR_MODAL);
      }

      if (error?.errorAction === 'delete-device') {
        this.modalService.showModalElement(DELETE_DEVICE_ERROR_MODAL);
      }
    });
  }

  private getMinutesFromSeconds(totalSeconds: number): number {
    return Math.round(totalSeconds / 60);
  }
}
