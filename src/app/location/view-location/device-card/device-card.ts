import { Component, EventEmitter, inject, Input, Output, OnDestroy } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { DeleteService } from '../../../services/delete';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { IDeleteEntityRequest, IDeleteDeviceResponse } from '../../../model/delete-actions';
import { IModal, IModalActions } from '../../../model/modal';
import { IDevice } from '../../../model/get-info';
import { DELETE_DEVICE_SUCCESS_MODAL } from '../../../constants/delete-constants';
import { DELETE_DEVICE_ERROR_MODAL } from '../../../constants/error-constants';

@Component({
  selector: 'device-card',
  imports: [MatButton, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardActions, DecimalPipe],
  templateUrl: './device-card.html',
  styleUrl: './device-card.scss',
})
export class DeviceCard implements OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly routerService = inject(RouterService);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);

  @Input({ required: true }) deviceInfo!: IDevice;
  @Output() deviceDeleted = new EventEmitter<IDeleteDeviceResponse>();

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected viewDeviceById(): void {
    this.routerService.viewDeviceById(this.deviceInfo.deviceId);
  }

  protected deleteDeviceVerification(): void {
    const deleteVerificationModal: IModal = {
      title: 'Confirmation',
      content: 'Are you sure you want to delete the device?',
      primaryText: 'Delete',
      secondaryText: 'Cancel',
    };

    const deleteVerificationActions: IModalActions = {
      primaryAction: () => this.deleteDevice(),
    };

    this.modalService.showModalElement(deleteVerificationModal, deleteVerificationActions);
  }

  private deleteDevice(): void {
    if (this.deviceInfo && this.deviceInfo.deviceId) {
      const deleteDeviceRequest: IDeleteEntityRequest = {
        id: this.deviceInfo.deviceId,
      };

      this.subscriptions.push(
        this.deleteService.deleteDeviceById(deleteDeviceRequest).subscribe({
          next: (response: IDeleteDeviceResponse) => {
            this.modalService.showModalElement(DELETE_DEVICE_SUCCESS_MODAL);
            this.deviceDeleted.emit(response);
          },
          error: () => {
            this.modalService.showModalElement(DELETE_DEVICE_ERROR_MODAL);
          },
        }),
      );
    } else {
      this.modalService.showModalElement(DELETE_DEVICE_ERROR_MODAL);
    }
  }
}
