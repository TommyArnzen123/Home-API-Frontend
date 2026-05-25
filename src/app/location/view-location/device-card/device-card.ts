import { Component, inject, Input } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { IModalActions } from '../../../model/modal';
import { DELETE_DEVICE_CONFIRMATION_MODAL } from '../../../constants/dialog-confirmation-constants';
import { DeviceData, EntityStore } from '../../../store/entity.store';

@Component({
  selector: 'device-card',
  imports: [MatButton, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardActions, DecimalPipe],
  templateUrl: './device-card.html',
  styleUrl: './device-card.scss',
})
export class DeviceCard {
  private readonly entityStore = inject(EntityStore);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  @Input({ required: true }) deviceInfo!: DeviceData;

  protected viewDeviceById(): void {
    if (this.deviceInfo && this.deviceInfo.entityId) {
      this.routerService.viewDeviceById(this.deviceInfo.entityId);
    }
  }

  protected deleteDeviceConfirmation(): void {
    if (this.deviceInfo && this.deviceInfo.entityId) {
      const deleteDeviceConfirmationActions: IModalActions = {
        primaryAction: () => this.entityStore.deleteDevice(this.deviceInfo.entityId),
      };

      this.modalService.showModalElement(
        DELETE_DEVICE_CONFIRMATION_MODAL,
        deleteDeviceConfirmationActions,
      );
    }
  }
}
