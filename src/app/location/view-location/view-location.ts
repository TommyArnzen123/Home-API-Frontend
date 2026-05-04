import { Component, inject, Signal, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { GetInfoService } from '../../services/get-info';
import { DeleteService } from '../../services/delete';
import { ModalService } from '../../services/modal';
import { LoginService } from '../../services/login';
import { BreadcrumbService } from '../../services/breadcrumb';
import { RouterService } from '../../services/router';
import { TemperatureThresholdCard } from './temperature-threshold-card/temperature-threshold-card';
import { DeviceCard } from './device-card/device-card';
import { IModalActions } from '../../model/modal';
import { IDevice, ILocation, IEntityInfoRequest } from '../../model/get-info';
import { IUser } from '../../model/login';
import {
  IDeleteEntityRequest,
  IDeleteLocationResponse,
  IDeleteDeviceResponse,
} from '../../model/delete-actions';
import {
  DELETE_LOCATION_ERROR_MODAL,
  VIEW_LOCATION_GET_INFO_ERROR_MODAL,
  INVALID_LOCATION_ID_ERROR_MODAL,
  ADD_TEMPERATURE_THRESHOLD_ERROR_MODAL,
} from '../../constants/error-constants';
import { DELETE_LOCATION_SUCCESS_MODAL } from '../../constants/delete-constants';
import { DELETE_LOCATION_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';
import { TemperatureThresholdService } from '../../services/temperature-threshold';
import {
  ITemperatureThreshold,
  ITemperatureThresholdRequest,
} from '../../model/temperature-threshold';
import { MatDialog } from '@angular/material/dialog';
import {
  ITemperatureThresholdModalLimits,
  TemperatureThresholdModal,
  TemperatureThresholdModalFlow,
} from './temperature-threshold-modal/temperature-threshold-modal';
import { ADD_TEMPERATURE_THRESHOLD_SUCCESS_MODAL } from '../../constants/success-constants';
import { setAverageTemperature } from '../../shared/utility/temperature-utility';

@Component({
  selector: 'view-location',
  imports: [MatButton, MatIcon, DeviceCard, TemperatureThresholdCard, DecimalPipe],
  templateUrl: './view-location.html',
  styleUrl: './view-location.scss',
})
export class ViewLocation implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private user: Signal<IUser | null>;

  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(RouterService);
  private readonly loginService = inject(LoginService);
  private readonly getInfoService = inject(GetInfoService);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly modal = inject(MatDialog);
  private readonly temperatureThresholdService = inject(TemperatureThresholdService);

  protected locationId: number | null = null;
  protected locationName: string | null = null;
  private homeId: number | null = null;
  protected devices: IDevice[] = [];
  protected totalDevices: number = 0;
  protected averageTemperature: number | null = null;
  protected temperatureThreshold = signal<ITemperatureThreshold | null>(null);

  constructor() {
    this.user = this.loginService.getUserLoginInfo();
    const id = Number(this.route.snapshot.paramMap.get('locationId'));

    if (isNaN(id)) {
      // If the value provided for the locationId is not a number, route the user away
      // from the view location page.
      const viewLocationInvalidLocationIDErrorActions: IModalActions = {
        primaryAction: () => this.viewHomeById(),
      };
      this.modalService.showModalElement(
        INVALID_LOCATION_ID_ERROR_MODAL,
        viewLocationInvalidLocationIDErrorActions,
      );
      this.locationId = null;
    } else {
      this.locationId = id;
      this.breadcrumbService.updateLocationId(this.locationId);
      this.breadcrumbService.updatePageInFocus('view-location');
    }
  }

  ngOnInit(): void {
    const jwtToken = this.user()?.jwtToken || undefined;

    if (this.isIUser(this.user()) && jwtToken) {
      const homeIdSignal: Signal<number | null> = this.breadcrumbService.getHomeId();
      this.homeId = homeIdSignal();

      if (this.locationId) {
        const getViewLocationInfoRequest: IEntityInfoRequest = {
          id: this.locationId,
          jwtToken,
        };

        // Get the location info.
        this.subscriptions.push(
          this.getInfoService.getViewLocationInfo(getViewLocationInfoRequest).subscribe({
            next: (response: ILocation) => {
              this.homeId = response.homeId;
              this.breadcrumbService.updateHomeId(response.homeId);
              this.locationName = response.locationName;
              this.devices = response.devices;
              this.totalDevices = response.devices.length;
              this.averageTemperature = setAverageTemperature(response.devices);
              this.temperatureThreshold.set(response.threshold);
            },
            error: () => {
              // If there is an error getting information for the view location page, display an error
              // message modal and route the user back to the view home route.
              const viewLocationGetInfoErrorActions: IModalActions = {
                primaryAction: () => this.viewHomeById(),
              };
              this.modalService.showModalElement(
                VIEW_LOCATION_GET_INFO_ERROR_MODAL,
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected viewRegisterDevicePage(): void {
    if (this.locationId !== null) {
      this.routerService.viewRegisterDevicePage(this.locationId);
    }
  }

  private viewHomeById(): void {
    if (this.homeId !== null) {
      this.routerService.viewHomeById(this.homeId);
    } else {
      // The home ID value is not set, route to the homescreen.
      this.viewHomescreen();
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  protected deleteLocationConfirmation(): void {
    const deleteLocationConfirmationActions: IModalActions = {
      primaryAction: () => this.deleteLocation(),
    };

    this.modalService.showModalElement(
      DELETE_LOCATION_CONFIRMATION_MODAL,
      deleteLocationConfirmationActions,
    );
  }

  private deleteLocation(): void {
    if (this.locationId) {
      const deleteLocationRequest: IDeleteEntityRequest = {
        id: this.locationId,
      };

      this.subscriptions.push(
        this.deleteService.deleteLocationById(deleteLocationRequest).subscribe({
          next: (response: IDeleteLocationResponse) => {
            this.modalService.showModalElement(DELETE_LOCATION_SUCCESS_MODAL);
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

  protected deviceDeletedAction(deleteDeviceResponse: IDeleteDeviceResponse): void {
    this.totalDevices = this.totalDevices - 1;

    // Remove the deleted device from the registered devices list.
    this.devices = this.devices.filter(
      (device) => device.deviceId !== deleteDeviceResponse.deviceId,
    );

    setAverageTemperature(this.devices);
  }

  protected displayTemperatureThresholdModal(): void {
    console.log('Display temperature threshold modal.');
    const flowType: TemperatureThresholdModalFlow = 'add-temperature-threshold';
    const addTemperatureThresholdModal = this.modal.open(TemperatureThresholdModal, {
      width: '400px',
      data: {
        flow: flowType,
      },
    });

    this.subscriptions.push(
      addTemperatureThresholdModal
        .afterClosed()
        .subscribe((result: ITemperatureThresholdModalLimits) => {
          if (result && (result.minimumTemperature || result.maximumTemperature)) {
            // Add the new temperature threshold value(s) to the database.
            this.addTemperatureThreshold(result);
          }
        }),
    );
  }

  private addTemperatureThreshold(threshold: ITemperatureThresholdModalLimits) {
    const jwtToken = this.user()?.jwtToken || undefined;

    if (this.locationId && jwtToken) {
      const request: ITemperatureThresholdRequest = {
        minimumTemperature: threshold.minimumTemperature,
        maximumTemperature: threshold.maximumTemperature,
        locationId: this.locationId,
        jwtToken,
      };

      this.temperatureThresholdService.addTemperatureThreshold(request).subscribe({
        next: (response: ITemperatureThreshold) => {
          this.modalService.showModalElement(ADD_TEMPERATURE_THRESHOLD_SUCCESS_MODAL);
          this.thresholdUpdated(response);
        },
        error: () => {
          // There was an error in the network call to add the new temperature threshold.
          this.modalService.showModalElement(ADD_TEMPERATURE_THRESHOLD_ERROR_MODAL);
        },
      });
    }
  }

  protected thresholdUpdated(threshold: ITemperatureThreshold | null): void {
    this.temperatureThreshold.set(threshold);
  }

  private isIUser(value: IUser | null): value is IUser {
    return this.loginService.isIUser(value);
  }
}
