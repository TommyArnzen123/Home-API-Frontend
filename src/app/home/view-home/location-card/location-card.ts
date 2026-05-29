import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { IModalActions } from '../../../model/modal';
import { DELETE_LOCATION_CONFIRMATION_MODAL } from '../../../constants/dialog-confirmation-constants';
import { isThresholdViolated } from '../../../shared/utility/temperature-utility';
import { EntityStore, LocationData } from '../../../store/entity.store';

@Component({
  selector: 'location-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions, MatButton, MatIcon, DecimalPipe],
  templateUrl: './location-card.html',
  styleUrl: './location-card.scss',
})
export class LocationCard implements OnInit {
  private readonly entityStore = inject(EntityStore);

  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  protected averageTemperature: number | null = null;
  protected minThreshold: number | null = null;
  protected maxThreshold: number | null = null;
  protected isTemperatureThresholdInViolation: boolean = false;

  @Input({ required: true }) locationInfo!: LocationData;

  ngOnInit(): void {
    this.minThreshold =
      this.locationInfo.summary &&
      this.locationInfo.summary.threshold &&
      this.locationInfo.summary.threshold.minimumTemperature
        ? this.locationInfo.summary.threshold.minimumTemperature
        : null;
    this.maxThreshold =
      this.locationInfo.summary &&
      this.locationInfo.summary.threshold &&
      this.locationInfo.summary.threshold.maximumTemperature
        ? this.locationInfo.summary.threshold.maximumTemperature
        : null;

    this.averageTemperature =
      this.locationInfo && this.locationInfo.summary && this.locationInfo.summary.averageTemperature
        ? this.locationInfo.summary.averageTemperature
        : null;

    this.setThresholdViolationStatus();
  }

  setThresholdViolationStatus() {
    if (this.averageTemperature && this.locationInfo.summary.threshold) {
      this.isTemperatureThresholdInViolation = isThresholdViolated(
        this.averageTemperature,
        this.locationInfo.summary.threshold.minimumTemperature,
        this.locationInfo.summary.threshold.maximumTemperature,
      );
    }
  }

  protected viewLocationById(): void {
    if (this.locationInfo && this.locationInfo.entityId) {
      this.routerService.viewLocationById(this.locationInfo.entityId);
    }
  }

  protected deleteLocationConfirmation(): void {
    const deleteLocationConfirmationActions: IModalActions = {
      primaryAction: () => this.entityStore.deleteLocation(this.locationInfo.entityId),
    };

    this.modalService.showModalElement(
      DELETE_LOCATION_CONFIRMATION_MODAL,
      deleteLocationConfirmationActions,
    );
  }
}
