import { Component, computed, effect, inject, input } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { IModalActions } from '../../../model/modal';
import { DELETE_LOCATION_CONFIRMATION_MODAL } from '../../../constants/dialog-confirmation-constants';
import {
  addTemperatureSymbol,
  fahrenheitToCelsius,
  isThresholdViolated,
} from '../../../shared/utility/temperature-utility';
import { EntityStore, LocationData } from '../../../store/entity.store';
import { TemperatureDisplayOptions } from '../../../model/account-settings';

@Component({
  selector: 'location-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions, MatButton, MatIcon],
  templateUrl: './location-card.html',
  styleUrl: './location-card.scss',
})
export class LocationCard {
  private readonly entityStore = inject(EntityStore);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  protected averageTemperature: number | undefined = undefined;
  protected averageTemperatureDisplay: string | undefined = undefined;
  protected minThreshold: number | undefined = undefined;
  protected minThresholdDisplay: string | undefined = undefined;
  protected maxThreshold: number | undefined = undefined;
  protected maxThresholdDisplay: string | undefined = undefined;
  protected isTemperatureThresholdInViolation: boolean = false;

  private isFahrenheitDisplay = computed(
    () =>
      this.entityStore.accountSettings()?.temperatureDisplaySetting ===
      TemperatureDisplayOptions.FAHRENHEIT,
  );

  locationInfo = input.required<LocationData>();

  constructor() {
    effect(() => {
      this.minThreshold =
        this.locationInfo().summary &&
        this.locationInfo().summary.threshold &&
        this.locationInfo().summary.threshold.minimumTemperature
          ? this.locationInfo().summary.threshold.minimumTemperature
          : undefined;

      this.minThresholdDisplay = this.formatTemperatureDisplay(this.minThreshold);
      this.setThresholdViolationStatus();
    });

    effect(() => {
      this.maxThreshold =
        this.locationInfo().summary &&
        this.locationInfo().summary.threshold &&
        this.locationInfo().summary.threshold.maximumTemperature
          ? this.locationInfo().summary.threshold.maximumTemperature
          : undefined;

      this.maxThresholdDisplay = this.formatTemperatureDisplay(this.maxThreshold);
      this.setThresholdViolationStatus();
    });

    effect(() => {
      this.averageTemperature =
        this.locationInfo &&
        this.locationInfo().summary &&
        this.locationInfo().summary.averageTemperature
          ? this.locationInfo().summary.averageTemperature
          : undefined;

      this.averageTemperatureDisplay = this.formatTemperatureDisplay(this.averageTemperature);
      this.setThresholdViolationStatus();
    });
  }

  formatTemperatureDisplay(originalTemp: number | undefined): string {
    let temp = '';
    if (originalTemp && !this.isFahrenheitDisplay()) {
      temp = fahrenheitToCelsius(originalTemp);
    } else if (originalTemp && this.isFahrenheitDisplay()) {
      temp = String(originalTemp);
    }

    return addTemperatureSymbol(temp, this.isFahrenheitDisplay());
  }

  // ngOnInit(): void {
  //   this.minThreshold =
  //     this.locationInfo().summary &&
  //     this.locationInfo().summary.threshold &&
  //     this.locationInfo().summary.threshold.minimumTemperature
  //       ? this.locationInfo().summary.threshold.minimumTemperature
  //       : undefined;

  //   this.maxThreshold =
  //     this.locationInfo().summary &&
  //     this.locationInfo().summary.threshold &&
  //     this.locationInfo().summary.threshold.maximumTemperature
  //       ? this.locationInfo().summary.threshold.maximumTemperature
  //       : undefined;

  //   this.averageTemperature =
  //     this.locationInfo &&
  //     this.locationInfo().summary &&
  //     this.locationInfo().summary.averageTemperature
  //       ? this.locationInfo().summary.averageTemperature
  //       : undefined;
  // }

  setThresholdViolationStatus() {
    if (this.averageTemperature && this.locationInfo().summary.threshold) {
      console.log(this.averageTemperature);
      console.log(this.locationInfo().summary.threshold.minimumTemperature);
      console.log(this.locationInfo().summary.threshold.maximumTemperature);
      this.isTemperatureThresholdInViolation = isThresholdViolated(
        this.averageTemperature,
        this.locationInfo().summary.threshold.minimumTemperature,
        this.locationInfo().summary.threshold.maximumTemperature,
      );
    }
  }

  protected viewLocationById(): void {
    if (this.locationInfo && this.locationInfo().entityId) {
      this.routerService.viewLocationById(this.locationInfo().entityId);
    }
  }

  protected deleteLocationConfirmation(): void {
    const deleteLocationConfirmationActions: IModalActions = {
      primaryAction: () => this.entityStore.deleteLocation(this.locationInfo().entityId),
    };

    this.modalService.showModalElement(
      DELETE_LOCATION_CONFIRMATION_MODAL,
      deleteLocationConfirmationActions,
    );
  }
}
