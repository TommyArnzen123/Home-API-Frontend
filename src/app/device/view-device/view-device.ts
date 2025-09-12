import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetInfoService } from '../../services/get-info.service';
import { IDeviceInformationCurrentDay } from '../../model/get-info.interface';
import { MatGridListModule } from '@angular/material/grid-list';
import { DisplayTempByHour } from './display-temp-by-hour/display-temp-by-hour';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { IModal } from '../../model/modal.interface';
import { DeleteService } from '../../services/delete.service';
import { DELETE_DEVICE_BY_ID_ERROR } from '../../error/error-constants';

@Component({
  selector: 'view-device',
  imports: [DisplayTempByHour, MatGridListModule, MatButton, DatePipe],
  templateUrl: './view-device.html',
  styleUrl: './view-device.scss',
})
export class ViewDevice implements OnInit {
  deviceId: string | null = null;
  deviceInformation!: IDeviceInformationCurrentDay;
  currentTemperatureDate!: Date;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly getInfoService: GetInfoService,
    private readonly deleteService: DeleteService,
    private readonly modalService: ModalService,
  ) {
    this.deviceId = this.route.snapshot.paramMap.get('deviceId');
  }

  ngOnInit(): void {
    if (this.deviceId) {
      this.getInfoService
        .getViewDeviceInformation(this.deviceId)
        .subscribe((response: IDeviceInformationCurrentDay) => {
          this.deviceInformation = response;
          this.currentTemperatureDate = new Date(response.mostRecentTemperatureAvailableDateTime);
        });
    } else {
      // Display an error message that the deviceId is not available, so the network call to get the information for the device cannot be run.
    }
  }

  deleteDeviceButtonAction(): void {
    if (this.deviceId) {
      this.deleteService.deleteDeviceById(this.deviceId).subscribe({
        next: (result) => {
          console.log(result);

          // Route the user to the 'View Location' screen for the location the device was associated with.
        },
        error: (error) => {
          console.log(error);
          this.modalService.showModalElement(DELETE_DEVICE_BY_ID_ERROR);
        },
      });
    }
  }
}
