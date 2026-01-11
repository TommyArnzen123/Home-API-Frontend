import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteService } from '../../../services/delete.service';
import { VIEW_DEVICE } from '../../../constants/navigation-constants';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { IDeleteDeviceRequest, IDeleteDeviceResponse } from '../../../model/delete-actions.interface';
import { ModalService } from '../../../services/modal.service';
import { DELETE_DEVICE_SUCCESS_MESSAGE } from '../../../constants/delete-constants';
import { DELETE_DEVICE_ERROR_MODAL } from '../../../constants/error-constants';

@Component({
  selector: 'device-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions],
  templateUrl: './device-card.html',
  styleUrl: './device-card.scss'
})
export class DeviceCard {
  @Input({ required: true }) deviceId!: number;
  @Input({ required: true }) deviceName!: string;

  @Output() deviceDeleted = new EventEmitter<IDeleteDeviceResponse>();

  constructor(private readonly router: Router,
    private readonly deleteService: DeleteService,
    private readonly modalService: ModalService
  ) {}

  viewDevice(): void {
    this.router.navigate([VIEW_DEVICE, this.deviceId]);
  }

  deleteDevice() {
    if (this.deviceId) {
      const deleteDeviceRequest: IDeleteDeviceRequest = {
        deviceId: this.deviceId,
      };
        
      this.deleteService.deleteDeviceById(deleteDeviceRequest).subscribe({
        next: (response: IDeleteDeviceResponse) => {
          this.modalService.showModalElement(DELETE_DEVICE_SUCCESS_MESSAGE);
          this.deviceDeleted.emit(response);
        },
        error: () => {
          this.modalService.showModalElement(DELETE_DEVICE_ERROR_MODAL);
        }
      });
    } else {
      this.modalService.showModalElement(DELETE_DEVICE_ERROR_MODAL);
    }
  }
}
