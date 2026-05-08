import { Component, inject, Input, OnInit, OnDestroy, effect } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { IModalActions } from '../../../model/modal';
import { ILocation } from '../../../model/get-info';
import { DELETE_LOCATION_ERROR_MODAL } from '../../../constants/error-constants';
import { DELETE_LOCATION_CONFIRMATION_MODAL } from '../../../constants/dialog-confirmation-constants';
import {
  isThresholdViolated,
  setAverageTemperature,
} from '../../../shared/utility/temperature-utility';
import { ViewHomeActions, ViewHomeStore } from '../view-home.store';

@Component({
  selector: 'location-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions, MatButton, MatIcon, DecimalPipe],
  templateUrl: './location-card.html',
  styleUrl: './location-card.scss',
})
export class LocationCard implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly viewHomeStore = inject(ViewHomeStore);

  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  protected averageTemperature: number | null = null;
  protected minThreshold: number | null = null;
  protected maxThreshold: number | null = null;
  protected isTemperatureThresholdInViolation: boolean = false;

  @Input({ required: true }) locationInfo!: ILocation;

  constructor() {
    this.setErrorEffects();
  }

  private setErrorEffects(): void {
    const modalActions: IModalActions = {
      primaryAction: () => this.viewHomeStore.resetNotificationState(),
    };

    effect(() => {
      const error: ViewHomeActions = this.viewHomeStore.errorNotification();

      if (error === 'delete-location') {
        this.modalService.showModalElement(DELETE_LOCATION_ERROR_MODAL, modalActions);
      }
    });
  }

  ngOnInit(): void {
    this.minThreshold =
      this.locationInfo.threshold && this.locationInfo.threshold.minimumTemperature
        ? this.locationInfo.threshold.minimumTemperature
        : null;
    this.maxThreshold =
      this.locationInfo.threshold && this.locationInfo.threshold.maximumTemperature
        ? this.locationInfo.threshold.maximumTemperature
        : null;

    this.averageTemperature = setAverageTemperature(this.locationInfo.devices);
    this.setThresholdViolationStatus();
  }

  setThresholdViolationStatus() {
    if (this.averageTemperature && this.locationInfo.threshold) {
      this.isTemperatureThresholdInViolation = isThresholdViolated(
        this.averageTemperature,
        this.locationInfo.threshold.minimumTemperature,
        this.locationInfo.threshold.maximumTemperature,
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected viewLocationById(): void {
    if (this.locationInfo && this.locationInfo.locationId) {
      this.routerService.viewLocationById(this.locationInfo.locationId);
    }
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
    if (this.locationInfo && this.locationInfo.locationId) {
      this.viewHomeStore.deleteLocation(this.locationInfo.locationId);
    } else {
      this.modalService.showModalElement(DELETE_LOCATION_ERROR_MODAL);
    }
  }
}
