import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { GetInfoService } from '../../services/get-info';
import { ModalService } from '../../services/modal';
import { DeleteService } from '../../services/delete';
import { BreadcrumbService } from '../../services/breadcrumb';
import { LoginService } from '../../services/login';
import { RouterService } from '../../services/router';
import { DisplayTempByHour } from './display-temp-by-hour/display-temp-by-hour';
import {
  IAverageTemperatureByHour,
  IDeviceInformationCurrentDay,
  IEntityInfoRequest,
} from '../../model/get-info';
import { IModalActions } from '../../model/modal';
import { IDeleteEntityRequest, IDeleteDeviceResponse } from '../../model/delete-actions';
import { IUser } from '../../model/login';
import {
  DELETE_DEVICE_ERROR_MODAL,
  VIEW_DEVICE_GET_INFO_ERROR_MODAL,
  VIEW_DEVICE_INVALID_DEVICE_ID_ERROR_MODAL,
} from '../../constants/error-constants';
import { DELETE_DEVICE_SUCCESS_MODAL } from '../../constants/delete-constants';
import { DELETE_DEVICE_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';

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

@Component({
  selector: 'view-device',
  imports: [MatButton, MatIcon, DisplayTempByHour, DatePipe, DecimalPipe],
  templateUrl: './view-device.html',
  styleUrl: './view-device.scss',
})
export class ViewDevice implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  protected deviceId: number | null = null;
  private locationId: number | null = null;
  protected deviceInformation!: IDeviceInformationCurrentDay;
  protected mostRecentTemperatureDate!: Date;

  private readonly route = inject(ActivatedRoute);
  private readonly getInfoService = inject(GetInfoService);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly loginService = inject(LoginService);
  private readonly routerService = inject(RouterService);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('deviceId'));

    if (isNaN(id)) {
      // If the value provided for the deviceId is not a number, route the user away
      // from the view device page.
      const viewDeviceInvalidDeviceIDErrorActions: IModalActions = {
        primaryAction: () => this.viewLocationById(),
      };
      this.modalService.showModalElement(
        VIEW_DEVICE_INVALID_DEVICE_ID_ERROR_MODAL,
        viewDeviceInvalidDeviceIDErrorActions,
      );
      this.deviceId = null;
    } else {
      this.deviceId = id;
      this.breadcrumbService.updatePageInFocus('view-device');
    }
  }

  ngOnInit(): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();
    const jwtToken = user()?.jwtToken || undefined;

    if (this.isIUser(user()) && jwtToken) {
      const locationIdSignal: Signal<number | null> = this.breadcrumbService.getLocationId();
      this.locationId = locationIdSignal();

      if (this.deviceId) {
        const getViewDeviceInfoRequest: IEntityInfoRequest = {
          id: this.deviceId,
          jwtToken,
        };

        this.subscriptions.push(
          this.getInfoService.getViewDeviceInformation(getViewDeviceInfoRequest).subscribe({
            next: (response: IDeviceInformationCurrentDay) => {
              this.locationId = response.locationId;
              this.deviceInformation = response;
              this.breadcrumbService.updateLocationId(response.locationId);
              this.breadcrumbService.updateHomeId(response.homeId);
              this.mostRecentTemperatureDate = new Date(
                response.mostRecentTemperatureAvailableDateTime,
              );
              this.insertAverageTemperatureByHourInformation(
                this.deviceInformation.averageTemperaturesByHourCurrentDay,
                // averageTempInfoMock, // Comment this line out for live data.
              );
            },
            error: () => {
              // If there is an error getting information for the view device page, display an error
              // message modal and route the user back to the view location route.
              const viewDeviceGetInfoErrorActions: IModalActions = {
                primaryAction: () => this.viewLocationById(),
              };
              this.modalService.showModalElement(
                VIEW_DEVICE_GET_INFO_ERROR_MODAL,
                viewDeviceGetInfoErrorActions,
              );
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

  protected deleteDeviceConfirmation(): void {
    const deleteDeviceConfirmationActions: IModalActions = {
      primaryAction: () => this.deleteDevice(),
    };

    this.modalService.showModalElement(
      DELETE_DEVICE_CONFIRMATION_MODAL,
      deleteDeviceConfirmationActions,
    );
  }

  private viewLocationById(): void {
    if (this.locationId !== null) {
      this.routerService.viewLocationById(this.locationId);
    } else {
      this.viewHomescreen();
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  private deleteDevice(): void {
    if (this.deviceId) {
      const deleteDeviceRequest: IDeleteEntityRequest = {
        id: this.deviceId,
      };

      this.subscriptions.push(
        this.deleteService.deleteDeviceById(deleteDeviceRequest).subscribe({
          next: (response: IDeleteDeviceResponse) => {
            this.modalService.showModalElement(DELETE_DEVICE_SUCCESS_MODAL);

            // Route to the view location page.
            this.viewLocationById();
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
  protected generateHourlyTemperatureReadings(): IAverageTemperatureByHour[] {
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

  private insertAverageTemperatureByHourInformation(tempInfo: IAverageTemperatureByHour[]): void {
    for (let i = 0; i < tempInfo.length; i++) {
      averageTempInfo[tempInfo[i].hour].averageTemperature = tempInfo[i].averageTemperature;
      averageTempInfo[tempInfo[i].hour].temperatureAvailable = true;
    }
  }

  private isIUser(value: IUser | null): value is IUser {
    return this.loginService.isIUser(value);
  }
}
