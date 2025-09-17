import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetInfoService } from '../../services/get-info.service';
import {
  IAverageTemperatureByHour,
  IDeviceInformationCurrentDay,
} from '../../model/get-info.interface';
import { MatGridListModule } from '@angular/material/grid-list';
import { DisplayTempByHour } from './display-temp-by-hour/display-temp-by-hour';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { DeleteService } from '../../services/delete.service';
import {
  DELETE_DEVICE_BY_ID_ERROR,
  GET_DEVICE_INFORMATION_BY_DEVICE_ID,
} from '../../error/error-constants';
import { IModal, IModalActions } from '../../model/modal.interface';

const averageTempInfo: IAverageTemperatureByHour[] = [
  { hour: 0, averageTemperature: 0, temperatureAvailable: false },
  { hour: 1, averageTemperature: 0, temperatureAvailable: false },
  { hour: 2, averageTemperature: 0, temperatureAvailable: false },
  { hour: 3, averageTemperature: 0, temperatureAvailable: false },
  { hour: 4, averageTemperature: 0, temperatureAvailable: false },
  { hour: 5, averageTemperature: 0, temperatureAvailable: false },
  { hour: 6, averageTemperature: 0, temperatureAvailable: false },
  { hour: 7, averageTemperature: 0, temperatureAvailable: false },
  { hour: 8, averageTemperature: 0, temperatureAvailable: false },
  { hour: 9, averageTemperature: 0, temperatureAvailable: false },
  { hour: 10, averageTemperature: 0, temperatureAvailable: false },
  { hour: 11, averageTemperature: 0, temperatureAvailable: false },
  { hour: 12, averageTemperature: 0, temperatureAvailable: false },
  { hour: 13, averageTemperature: 0, temperatureAvailable: false },
  { hour: 14, averageTemperature: 0, temperatureAvailable: false },
  { hour: 15, averageTemperature: 0, temperatureAvailable: false },
  { hour: 16, averageTemperature: 0, temperatureAvailable: false },
  { hour: 17, averageTemperature: 0, temperatureAvailable: false },
  { hour: 18, averageTemperature: 0, temperatureAvailable: false },
  { hour: 19, averageTemperature: 0, temperatureAvailable: false },
  { hour: 20, averageTemperature: 0, temperatureAvailable: false },
  { hour: 21, averageTemperature: 0, temperatureAvailable: false },
  { hour: 22, averageTemperature: 0, temperatureAvailable: false },
  { hour: 23, averageTemperature: 0, temperatureAvailable: false },
];

const averageTempInfoMock: IAverageTemperatureByHour[] = [
  // { hour: 0, averageTemperature: 0, temperatureAvailable: true },
  { hour: 1, averageTemperature: 1, temperatureAvailable: true },
  // { hour: 2, averageTemperature: 0, temperatureAvailable: false },
  { hour: 3, averageTemperature: 3, temperatureAvailable: true },
  // { hour: 4, averageTemperature: 4, temperatureAvailable: true },
  { hour: 5, averageTemperature: 5, temperatureAvailable: true },
  // { hour: 6, averageTemperature: 6, temperatureAvailable: true },
  { hour: 7, averageTemperature: 7, temperatureAvailable: true },
  // { hour: 8, averageTemperature: 8, temperatureAvailable: true },
  { hour: 9, averageTemperature: 9, temperatureAvailable: true },
  // { hour: 10, averageTemperature: 10, temperatureAvailable: true },
  { hour: 11, averageTemperature: 11, temperatureAvailable: true },
  // { hour: 12, averageTemperature: 12, temperatureAvailable: true },
  { hour: 13, averageTemperature: 13, temperatureAvailable: true },
  // { hour: 14, averageTemperature: 14, temperatureAvailable: true },
  { hour: 15, averageTemperature: 15, temperatureAvailable: true },
  // { hour: 16, averageTemperature: 16, temperatureAvailable: true },
  { hour: 17, averageTemperature: 17, temperatureAvailable: true },
  // { hour: 18, averageTemperature: 0, temperatureAvailable: false },
  { hour: 19, averageTemperature: 19, temperatureAvailable: true },
  // { hour: 20, averageTemperature: 20, temperatureAvailable: true },
  { hour: 21, averageTemperature: 21, temperatureAvailable: true },
  // { hour: 22, averageTemperature: 22, temperatureAvailable: true },
  { hour: 23, averageTemperature: 23, temperatureAvailable: true },
];

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
  averageTemperatureByHour: IAverageTemperatureByHour[] = [];
  deviceExists = false;

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
      this.getInfoService.getViewDeviceInformation(this.deviceId).subscribe({
        next: (response: IDeviceInformationCurrentDay) => {
          this.deviceInformation = response;
          this.currentTemperatureDate = new Date(response.mostRecentTemperatureAvailableDateTime);
          this.insertAverageTemperatureByHourInformation(
            // this.deviceInformation.averageTemperaturesByHourCurrentDay,
            averageTempInfoMock, // Comment this line out for live data.
          );

          if (response.deviceId === Number(this.deviceId)) {
            this.deviceExists = true;
          }
        },
        error: () => {
          this.modalService.showModalElement(GET_DEVICE_INFORMATION_BY_DEVICE_ID);
        },
      });
    } else {
      // Display an error message that the deviceId is not available, so the network call to get the information for the device cannot be run.
    }
  }

  deleteDeviceVerification(): void {
    const deleteVerificationModal: IModal = {
      title: 'Confirmation',
      content: 'Are you sure you want to delete the device?',
      primaryText: 'Delete',
      secondaryText: 'Cancel',
    };

    const deleteVerificationActions: IModalActions = {
      primaryAction: () => this.deleteDeviceButtonAction(),
      secondaryAction: () => this.modalService.closeModalElement(),
    };

    this.modalService.showModalElement(deleteVerificationModal, deleteVerificationActions);
  }

  deleteDeviceButtonAction() {
    if (this.deviceId) {
      this.deleteService.deleteDeviceById(this.deviceId).subscribe({
        next: (result) => {
          console.log(result);

          // Route the user to the 'View Location' screen for the location the device was associated with.
        },
        error: () => {
          this.modalService.showModalElement(DELETE_DEVICE_BY_ID_ERROR);
        },
      });
    }
  }

  // Generate an array of average temperature by hour objects with the current hour as the last item in the array.
  generateHourlyTemperatureReading(): IAverageTemperatureByHour[] {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    const formattedAverageTemperaturesByHour: IAverageTemperatureByHour[] = [];

    const startingIndex = currentHour < 23 ? currentHour + 1 : 0;

    for (let i = startingIndex; i <= 23; i++) {
      if (averageTempInfo[i] && averageTempInfo[i].hour === i) {
        formattedAverageTemperaturesByHour.push(averageTempInfo[i]);
      }
    }

    if (startingIndex !== 0) {
      for (let i = 0; i < startingIndex; i++) {
        if (averageTempInfo[i] && averageTempInfo[i].hour === i) {
          formattedAverageTemperaturesByHour.push(averageTempInfo[i]);
        }
      }
    }

    return formattedAverageTemperaturesByHour;
  }

  insertAverageTemperatureByHourInformation(tempInfo: IAverageTemperatureByHour[]): void {
    for (let i = 0; i < tempInfo.length; i++) {
      averageTempInfo[tempInfo[i].hour].averageTemperature = tempInfo[i].averageTemperature;
      averageTempInfo[tempInfo[i].hour].temperatureAvailable = true;
    }
  }
}
