import { Component, inject, Signal, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { GetInfoService } from '../../services/get-info.service';
import { DeleteService } from '../../services/delete.service';
import { ModalService } from '../../services/modal.service';
import { LoginService } from '../../services/login.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { RouterService } from '../../services/router.service';
import { DeviceCard } from './device-card/device-card';
import { IModal, IModalActions } from '../../model/modal';
import { IDevice, ILocation, IEntityInfoRequest } from '../../model/get-info';
import { IUser } from '../../model/login';
import {
  IDeleteDeviceResponse,
  IDeleteEntityRequest,
  IDeleteLocationResponse,
} from '../../model/delete-actions';
import { DELETE_LOCATION_ERROR_MODAL } from '../../constants/error-constants';
import { DELETE_LOCATION_SUCCESS_MESSAGE } from '../../constants/delete-constants';

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
  private readonly routerService = inject(RouterService);
  private readonly loginService = inject(LoginService);
  private readonly getInfoService = inject(GetInfoService);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  constructor() {
    const locationId = Number(this.route.snapshot.paramMap.get('locationId'));
    console.log(locationId);
    if (isNaN(locationId)) {
      // If the value provided for the locationId is not a number, route the user away
      // from the view location page.
      const viewLocationInvalidLocationIDErrorModal: IModal = {
        title: 'Something Went Wrong...',
        content: 'The location ID provided was invalid.',
        disableClose: true,
      };
      const viewLocationInvalidLocationIDErrorActions: IModalActions = {
        primaryAction: () => this.viewHomeById(),
      };
      this.modalService.showModalElement(
        viewLocationInvalidLocationIDErrorModal,
        viewLocationInvalidLocationIDErrorActions,
      );
    } else {
      this.locationId = locationId;
      this.breadcrumbService.updateLocationId(this.locationId);
      this.breadcrumbService.updatePageInFocus('view-location');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();
    const homeIdSignal: Signal<number | null> = this.breadcrumbService.getHomeId();
    this.homeId = homeIdSignal();

    if (this.isIUser(user())) {
      if (this.locationId) {
        console.log(this.locationId);
        const getViewLocationInfoRequest: IEntityInfoRequest = {
          id: this.locationId,
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
              this.breadcrumbService.updateHomeId(response.homeId);
            },
            error: () => {
              // If there is an error getting information for the view location page, display an error
              // message modal and route the user back to the view home route.
              const viewLocationGetInfoErrorModal: IModal = {
                title: 'Something Went Wrong...',
                content: 'There was an error viewing the selected location.',
                disableClose: true,
              };
              const viewLocationGetInfoErrorActions: IModalActions = {
                primaryAction: () => this.viewHomeById(),
              };
              this.modalService.showModalElement(
                viewLocationGetInfoErrorModal,
                viewLocationGetInfoErrorActions,
              );
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

  viewRegisterDevicePage() {
    const id = this.locationId;
    if (id !== null) {
      this.routerService.viewRegisterDevicePage(id);
    }
  }

  viewHomeById() {
    if (this.homeId !== null) {
      this.routerService.viewHomeById(this.homeId);
    } else {
      // The home ID value is not set, route to the home screen.
      this.viewHomePage();
    }
  }

  viewHomePage() {
    this.routerService.viewHomePage();
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
      const deleteLocationRequest: IDeleteEntityRequest = {
        id: this.locationId,
      };

      this.subscriptions.push(
        this.deleteService.deleteLocationById(deleteLocationRequest).subscribe({
          next: (response: IDeleteLocationResponse) => {
            this.modalService.showModalElement(DELETE_LOCATION_SUCCESS_MESSAGE);

            this.viewHomeById();
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
