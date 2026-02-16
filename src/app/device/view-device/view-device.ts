import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { GetInfoService } from '../../services/get-info.service';
import { ModalService } from '../../services/modal.service';
import { DeleteService } from '../../services/delete.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { LoginService } from '../../services/login.service';
import { DisplayTempByHour } from './display-temp-by-hour/display-temp-by-hour';
import { DELETE_DEVICE_ERROR_MODAL } from '../../constants/error-constants';
import { DELETE_DEVICE_SUCCESS_MESSAGE } from '../../constants/delete-constants';
import { VIEW_LOCATION } from '../../constants/navigation-constants';
import {
  IAverageTemperatureByHour,
  IDeviceInformationCurrentDay,
} from '../../model/get-info.interface';
import { IModal, IModalActions } from '../../model/modal.interface';
import { IDeleteDeviceRequest, IDeleteDeviceResponse } from '../../model/delete-actions.interface';
import { IUser } from '../../model/login.interface';

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

// const averageTempInfoMock: IAverageTemperatureByHour[] = [
//   // { hour: 0, averageTemperature: 0, temperatureAvailable: true },
//   { hour: 1, averageTemperature: 1, temperatureAvailable: true },
//   // { hour: 2, averageTemperature: 0, temperatureAvailable: false },
//   { hour: 3, averageTemperature: 3, temperatureAvailable: true },
//   // { hour: 4, averageTemperature: 4, temperatureAvailable: true },
//   { hour: 5, averageTemperature: 5, temperatureAvailable: true },
//   // { hour: 6, averageTemperature: 6, temperatureAvailable: true },
//   { hour: 7, averageTemperature: 7, temperatureAvailable: true },
//   // { hour: 8, averageTemperature: 8, temperatureAvailable: true },
//   { hour: 9, averageTemperature: 9, temperatureAvailable: true },
//   // { hour: 10, averageTemperature: 10, temperatureAvailable: true },
//   { hour: 11, averageTemperature: 11, temperatureAvailable: true },
//   // { hour: 12, averageTemperature: 12, temperatureAvailable: true },
//   { hour: 13, averageTemperature: 13, temperatureAvailable: true },
//   // { hour: 14, averageTemperature: 14, temperatureAvailable: true },
//   { hour: 15, averageTemperature: 15, temperatureAvailable: true },
//   // { hour: 16, averageTemperature: 16, temperatureAvailable: true },
//   { hour: 17, averageTemperature: 17, temperatureAvailable: true },
//   // { hour: 18, averageTemperature: 0, temperatureAvailable: false },
//   { hour: 19, averageTemperature: 19, temperatureAvailable: true },
//   // { hour: 20, averageTemperature: 20, temperatureAvailable: true },
//   { hour: 21, averageTemperature: 21, temperatureAvailable: true },
//   // { hour: 22, averageTemperature: 22, temperatureAvailable: true },
//   { hour: 23, averageTemperature: 23, temperatureAvailable: true },
// ];

@Component({
  selector: 'view-device',
  imports: [MatGridListModule, MatButton, MatIcon, DisplayTempByHour, DatePipe],
  templateUrl: './view-device.html',
  styleUrl: './view-device.scss',
})
export class ViewDevice implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  deviceId: number | null = null;
  locationId: number | null = null;
  deviceInformation!: IDeviceInformationCurrentDay;
  mostRecentTemperatureDate!: Date;
  averageTemperatureByHour: IAverageTemperatureByHour[] = [];

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly getInfoService = inject(GetInfoService);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly loginService = inject(LoginService);

  constructor() {
    this.deviceId = Number(this.route.snapshot.paramMap.get('deviceId'));
    this.breadcrumbService.updateDeviceId(this.deviceId);
  }

  private isIUser(value: IUser | null): value is IUser {
    return (
      value !== null &&
      typeof value.firstName === 'string' &&
      typeof value.username === 'string' &&
      typeof value.username === 'string' &&
      typeof value.jwtToken === 'string'
    );
  }

  ngOnInit(): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();

    if (this.isIUser(user())) {
      if (this.deviceId) {
        this.subscriptions.push(
          this.getInfoService.getViewDeviceInformation(this.deviceId).subscribe({
            next: (response: IDeviceInformationCurrentDay) => {
              this.locationId = response.locationId;
              this.deviceInformation = response;
              this.mostRecentTemperatureDate = new Date(
                response.mostRecentTemperatureAvailableDateTime,
              );
              this.insertAverageTemperatureByHourInformation(
                this.deviceInformation.averageTemperaturesByHourCurrentDay,
                // averageTempInfoMock, // Comment this line out for live data.
              );
            },
            error: () => {
              console.log('Get view device information error.');
            },
          }),
        );
      }
    } else {
      this.loginService.logout();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  deleteDeviceVerification(): void {
    const deleteVerificationModal: IModal = {
      title: 'Confirmation',
      content: 'Are you sure you want to delete the device?',
      primaryText: 'Delete',
      secondaryText: 'Cancel',
    };

    const deleteVerificationActions: IModalActions = {
      primaryAction: () => this.deleteDeviceAction(),
      secondaryAction: () => this.modalService.closeModalElement(),
    };

    this.modalService.showModalElement(deleteVerificationModal, deleteVerificationActions);
  }

  returnToViewLocation() {
    // Route to the view location page.
    this.router.navigate([VIEW_LOCATION, this.locationId]);
  }

  deleteDeviceAction() {
    if (this.deviceId) {
      const deleteDeviceRequest: IDeleteDeviceRequest = {
        deviceId: this.deviceId,
      };

      this.subscriptions.push(
        this.deleteService.deleteDeviceById(deleteDeviceRequest).subscribe({
          next: (response: IDeleteDeviceResponse) => {
            this.modalService.showModalElement(DELETE_DEVICE_SUCCESS_MESSAGE);

            // Route to the view location page.
            this.returnToViewLocation();
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

  // Generate an array of average temperature by hour objects
  // with the current hour as the last item in the array.
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
