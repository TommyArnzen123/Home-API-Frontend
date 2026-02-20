import { Component, inject, Signal, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { GetInfoService } from '../../services/get-info.service';
import { DeleteService } from '../../services/delete.service';
import { ModalService } from '../../services/modal.service';
import { LoginService } from '../../services/login.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { DeviceCard } from './device-card/device-card';
import { IModal, IModalActions } from '../../model/modal.interface';
import { IDevice, ILocation, IViewLocationInfoRequest } from '../../model/get-info.interface';
import { IUser } from '../../model/login.interface';
import {
  IDeleteDeviceResponse,
  IDeleteLocationRequest,
  IDeleteLocationResponse,
} from '../../model/delete-actions.interface';
import { REGISTER_DEVICE_ROUTE, VIEW_HOME_ROUTE } from '../../constants/navigation-constants';
import { DELETE_LOCATION_ERROR_MODAL } from '../../constants/error-constants';
import { DELETE_LOCATION_SUCCESS_MESSAGE } from '../../constants/delete-constants';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'view-location',
  imports: [MatGridListModule, MatButton, MatIcon, DeviceCard, DecimalPipe],
  templateUrl: './view-location.html',
  styleUrl: './view-location.scss',
})
export class ViewLocation implements OnDestroy {
  subscriptions: Subscription[] = [];

  locationId: number | null = null;
  locationName: string | null = null;
  homeId: number | null = null;
  devices: IDevice[] = [];
  totalDevices: number = 0;
  averageTemperature: number | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);
  private readonly getInfoService = inject(GetInfoService);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  constructor() {
    this.locationId = Number(this.route.snapshot.paramMap.get('locationId'));
    this.breadcrumbService.updateLocationId(this.locationId);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();

    if (this.isIUser(user())) {
      if (this.locationId) {
        const getViewLocationInfoRequest: IViewLocationInfoRequest = {
          locationId: this.locationId,
          jwtToken: user()!.jwtToken,
        };

        // Get the location info.
        this.subscriptions.push(
          this.getInfoService.getViewLocationInfo(getViewLocationInfoRequest).subscribe({
            next: (response: ILocation) => {
              this.homeId = response.homeId;
              this.locationName = response.locationName;
              this.devices = response.devices;
              this.totalDevices = response.devices.length;
              this.setAverageTemperature(response.devices);
            },
            error: () => {
              // If there is an error getting the information on the home screen, log the user out.
              // They will not be able to use the application without the information returned from the
              // get home screen info endpoint.
              this.loginService.logout();
            },
          }),
        );
      }
    } else {
      this.loginService.logout();
    }
  }

  private setAverageTemperature(devices: IDevice[]): void {
    let counter = 0;
    let averageTemp: number | null = null;
    devices.forEach((device) => {
      if (device.temperature) {
        averageTemp = averageTemp
          ? averageTemp + device.temperature.temperature
          : device.temperature.temperature;
        counter++;
      }
    });

    this.averageTemperature = averageTemp ? averageTemp / counter : null;
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

  registerDevice() {
    this.router.navigate([REGISTER_DEVICE_ROUTE, this.locationId]);
  }

  returnToViewHome() {
    // Route to the view home page.
    this.router.navigate([VIEW_HOME_ROUTE, this.homeId]);
  }

  deleteLocationVerification(): void {
    const deleteVerificationModal: IModal = {
      title: 'Confirmation',
      content: 'Are you sure you want to delete the location?',
      primaryText: 'Delete',
      secondaryText: 'Cancel',
    };

    const deleteVerificationActions: IModalActions = {
      primaryAction: () => this.deleteLocation(),
      secondaryAction: () => this.modalService.closeModalElement(),
    };

    this.modalService.showModalElement(deleteVerificationModal, deleteVerificationActions);
  }

  deleteLocation() {
    if (this.locationId) {
      const deleteLocationRequest: IDeleteLocationRequest = {
        locationId: this.locationId,
      };

      this.subscriptions.push(
        this.deleteService.deleteLocationById(deleteLocationRequest).subscribe({
          next: (response: IDeleteLocationResponse) => {
            this.modalService.showModalElement(DELETE_LOCATION_SUCCESS_MESSAGE);

            this.returnToViewHome();
          },
          error: () => {
            this.modalService.showModalElement(DELETE_LOCATION_ERROR_MODAL);
          },
        }),
      );
    } else {
      this.modalService.showModalElement(DELETE_LOCATION_ERROR_MODAL);
    }
  }

  deviceDeletedAction(deleteDeviceResponse: IDeleteDeviceResponse) {
    this.totalDevices = this.totalDevices - 1;

    // Remove the deleted device from the registered devices list.
    this.devices = this.devices.filter(
      (device) => device.deviceId !== deleteDeviceResponse.deviceId,
    );
  }
}
