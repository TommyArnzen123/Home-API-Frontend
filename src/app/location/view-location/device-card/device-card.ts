import { Component, EventEmitter, inject, Input, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { DeleteService } from '../../../services/delete.service';
import { ModalService } from '../../../services/modal.service';
import { VIEW_DEVICE_ROUTE } from '../../../constants/navigation-constants';
import { DELETE_DEVICE_SUCCESS_MESSAGE } from '../../../constants/delete-constants';
import { DELETE_DEVICE_ERROR_MODAL } from '../../../constants/error-constants';
import {
  IDeleteDeviceRequest,
  IDeleteDeviceResponse,
} from '../../../model/delete-actions.interface';
import { IModal, IModalActions } from '../../../model/modal.interface';
import { IDevice } from '../../../model/get-info.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'device-card',
  imports: [MatCard, MatButton, MatIcon, MatCardHeader, MatCardTitle, MatCardActions, DecimalPipe],
  templateUrl: './device-card.html',
  styleUrl: './device-card.scss',
})
export class DeviceCard implements OnDestroy {
  subscriptions: Subscription[] = [];

  @Input({ required: true }) deviceInfo!: IDevice;
  // @Input({ required: true }) deviceId!: number;
  // @Input({ required: true }) deviceName!: string;

  @Output() deviceDeleted = new EventEmitter<IDeleteDeviceResponse>();

  private readonly router = inject(Router);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  viewDevice(): void {
    this.router.navigate([VIEW_DEVICE_ROUTE, this.deviceInfo.deviceId]);
  }

  deleteDeviceVerification(): void {
    const deleteVerificationModal: IModal = {
      title: 'Confirmation',
      content: 'Are you sure you want to delete the device?',
      primaryText: 'Delete',
      secondaryText: 'Cancel',
    };

    const deleteVerificationActions: IModalActions = {
      primaryAction: () => this.deleteDevice(),
      secondaryAction: () => this.modalService.closeModalElement(),
    };

    this.modalService.showModalElement(deleteVerificationModal, deleteVerificationActions);
  }

  deleteDevice() {
    if (this.deviceInfo && this.deviceInfo.deviceId) {
      const deleteDeviceRequest: IDeleteDeviceRequest = {
        deviceId: this.deviceInfo.deviceId,
      };

      this.subscriptions.push(
        this.deleteService.deleteDeviceById(deleteDeviceRequest).subscribe({
          next: (response: IDeleteDeviceResponse) => {
            this.modalService.showModalElement(DELETE_DEVICE_SUCCESS_MESSAGE);
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
