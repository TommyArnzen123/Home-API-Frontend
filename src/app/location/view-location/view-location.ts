import { Component, inject, OnDestroy, effect, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal';
import { BreadcrumbService } from '../../services/breadcrumb';
import { RouterService } from '../../services/router';
import { TemperatureThresholdCard } from './temperature-threshold-card/temperature-threshold-card';
import { DeviceCard } from './device-card/device-card';
import { IModalActions } from '../../model/modal';
import { ILocation } from '../../model/get-info';
import {
  DELETE_LOCATION_ERROR_MODAL,
  VIEW_LOCATION_GET_INFO_ERROR_MODAL,
  INVALID_LOCATION_ID_ERROR_MODAL,
  ADD_TEMPERATURE_THRESHOLD_ERROR_MODAL,
} from '../../constants/error-constants';
import {
  DELETE_DEVICE_SUCCESS_MODAL,
  DELETE_LOCATION_SUCCESS_MODAL,
  DELETE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL,
} from '../../constants/delete-constants';
import { DELETE_LOCATION_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';
import { MatDialog } from '@angular/material/dialog';
import {
  ITemperatureThresholdModalLimits,
  TemperatureThresholdModal,
  TemperatureThresholdModalFlow,
} from './temperature-threshold-modal/temperature-threshold-modal';
import { ADD_TEMPERATURE_THRESHOLD_SUCCESS_MODAL } from '../../constants/success-constants';
import { ViewLocationActions, ViewLocationStore } from './view-location.store';

@Component({
  selector: 'view-location',
  imports: [MatButton, MatIcon, DeviceCard, TemperatureThresholdCard, DecimalPipe],
  templateUrl: './view-location.html',
  styleUrl: './view-location.scss',
})
export class ViewLocation implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly modal = inject(MatDialog);
  private readonly viewLocationStore = inject(ViewLocationStore);
  protected averageTemperature: number | null = null;
  protected locationInfo: ILocation | null = null;

  constructor() {
    this.setSuccessEffects();
    this.setErrorEffects();
    this.setGeneralEffects();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('locationId')); // Get the location id from the URL.

    if (isNaN(id)) {
      this.displayInvalidLocationIdError();
    } else {
      this.breadcrumbService.updateLocationId(id);
      this.breadcrumbService.updatePageInFocus('view-location');
    }

    this.viewLocationStore.reset();
    this.viewLocationStore.getLocationInfo(id); // Get location info.
  }

  private displayInvalidLocationIdError(): void {
    // If the value provided for the locationId is not a number, route the user away
    // from the view location page.
    const viewLocationInvalidLocationIDErrorActions: IModalActions = {
      primaryAction: () => this.viewHomeById(),
    };
    this.modalService.showModalElement(
      INVALID_LOCATION_ID_ERROR_MODAL,
      viewLocationInvalidLocationIDErrorActions,
    );
  }

  private setGeneralEffects(): void {
    // Get the location info as it is updated over time.
    effect(() => {
      this.locationInfo = this.viewLocationStore.locationInfo();
    });

    effect(() => {
      this.averageTemperature = this.viewLocationStore.averageTemperature();
    });
  }

  private setSuccessEffects(): void {
    const modalActions: IModalActions = {
      primaryAction: () => this.viewLocationStore.resetNotificationState(),
    };

    effect(() => {
      const success: ViewLocationActions = this.viewLocationStore.successNotification();

      if (success === 'add-threshold') {
        this.modalService.showModalElement(ADD_TEMPERATURE_THRESHOLD_SUCCESS_MODAL, modalActions);
      }

      if (success === 'delete-threshold') {
        this.modalService.showModalElement(
          DELETE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL,
          modalActions,
        );
      }

      if (success === 'delete-location') {
        this.modalService.showModalElement(DELETE_LOCATION_SUCCESS_MODAL, modalActions);
        this.viewHomeById();
      }

      if (success === 'delete-device') {
        this.modalService.showModalElement(DELETE_DEVICE_SUCCESS_MODAL, modalActions);
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: ViewLocationActions = this.viewLocationStore.errorNotification();

      if (error === 'get-view-location-info') {
        const viewLocationGetInfoErrorActions: IModalActions = {
          primaryAction: () => {
            this.viewLocationStore.resetNotificationState();
            this.viewHomeById();
          },
        };
        this.modalService.showModalElement(
          VIEW_LOCATION_GET_INFO_ERROR_MODAL,
          viewLocationGetInfoErrorActions,
        );
      }

      if (error === 'add-threshold') {
        this.modalService.showModalElement(ADD_TEMPERATURE_THRESHOLD_ERROR_MODAL);
      }

      if (error === 'delete-location') {
        this.modalService.showModalElement(DELETE_LOCATION_ERROR_MODAL);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected viewRegisterDevicePage(): void {
    if (this.locationInfo && this.locationInfo.locationId !== null) {
      this.routerService.viewRegisterDevicePage(this.locationInfo.locationId);
    }
  }

  private viewHomeById(): void {
    if (this.locationInfo && this.locationInfo.homeId !== null) {
      this.routerService.viewHomeById(this.locationInfo.homeId);
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
    this.viewLocationStore.deleteLocation();
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
            this.viewLocationStore.addTemperatureThreshold({
              minimumTemperature: result.minimumTemperature,
              maximumTemperature: result.maximumTemperature,
            });
          }
        }),
    );
  }
}
