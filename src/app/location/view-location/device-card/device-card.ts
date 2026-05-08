import { Component, inject, Input, effect } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { ViewLocationActions, ViewLocationStore } from '../view-location.store';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { IModalActions } from '../../../model/modal';
import { IDevice } from '../../../model/get-info';
import { DELETE_DEVICE_ERROR_MODAL } from '../../../constants/error-constants';
import { DELETE_DEVICE_CONFIRMATION_MODAL } from '../../../constants/dialog-confirmation-constants';

@Component({
  selector: 'device-card',
  imports: [MatButton, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardActions, DecimalPipe],
  templateUrl: './device-card.html',
  styleUrl: './device-card.scss',
})
export class DeviceCard {
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);
  private readonly viewLocationStore = inject(ViewLocationStore);
  @Input({ required: true }) deviceInfo!: IDevice;

  constructor() {
    this.setErrorEffects();
  }

  private setErrorEffects(): void {
    const modalActions: IModalActions = {
      primaryAction: () => this.viewLocationStore.resetNotificationState(),
    };

    effect(() => {
      const error: ViewLocationActions = this.viewLocationStore.errorNotification();

      if (error === 'delete-device') {
        this.modalService.showModalElement(DELETE_DEVICE_ERROR_MODAL, modalActions);
      }
    });
  }

  protected viewDeviceById(): void {
    if (this.deviceInfo && this.deviceInfo.deviceId) {
      this.routerService.viewDeviceById(this.deviceInfo.deviceId);
    }
  }

  protected deleteDeviceConfirmation(): void {
    const deleteDeviceConfirmationActions: IModalActions = {
      primaryAction: () => this.deleteDevice(),
    };

    this.modalService.showModalElement(
      DELETE_DEVICE_CONFIRMATION_MODAL,
      deleteDeviceConfirmationActions,
    );
  }

  private deleteDevice(): void {
    if (this.deviceInfo && this.deviceInfo.deviceId) {
      this.viewLocationStore.deleteDevice(this.deviceInfo.deviceId);
    } else {
      this.modalService.showModalElement(DELETE_DEVICE_ERROR_MODAL);
    }
  }
}
