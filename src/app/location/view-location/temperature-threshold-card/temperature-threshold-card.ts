import { Component, computed, effect, inject, input, OnDestroy } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { ITemperatureThreshold } from '../../../model/temperature-threshold';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import {
  ITemperatureThresholdModal,
  ITemperatureThresholdModalLimits,
  TemperatureThresholdModal,
  TemperatureThresholdModalFlow,
} from '../temperature-threshold-modal/temperature-threshold-modal';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../services/modal';
import { IModalActions } from '../../../model/modal';
import { DELETE_TEMPERATURE_THRESHOLD_CONFIRMATION_MODAL } from '../../../constants/dialog-confirmation-constants';
import { MatIcon } from '@angular/material/icon';
import { EntityStore } from '../../../store/entity.store';
import { TemperatureDisplayOptions } from '../../../model/account-settings';
import {
  addTemperatureSymbol,
  fahrenheitToCelsius,
} from '../../../shared/utility/temperature-utility';
import { IconElement } from '../../../shared/components/icon-element/icon-element';
import { DeleteButtonElement } from '../../../shared/components/button-element/delete-button-element';

@Component({
  selector: 'temperature-threshold-card',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardActions,
    MatButton,
    IconElement,
    DeleteButtonElement,
  ],
  templateUrl: './temperature-threshold-card.html',
  styleUrl: './temperature-threshold-card.scss',
})
export class TemperatureThresholdCard implements OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly entityStore = inject(EntityStore);
  private readonly modal = inject(MatDialog);
  private readonly modalService = inject(ModalService);

  averageTemperature = input.required<number | null>();
  temperatureThreshold = input.required<ITemperatureThreshold | undefined>();
  protected minTemperature: number | undefined = undefined;
  protected minTemperatureDisplay: string | undefined = undefined;
  protected maxTemperature: number | undefined = undefined;
  protected maxTemperatureDisplay: string | undefined = undefined;
  protected isTemperatureThresholdInViolation: boolean = false;

  private isFahrenheitDisplay = computed(
    () =>
      this.entityStore.accountSettings()?.temperatureDisplaySetting ===
      TemperatureDisplayOptions.FAHRENHEIT,
  );

  constructor() {
    effect(() => {
      const threshold: ITemperatureThreshold | undefined = this.temperatureThreshold();
      this.minTemperature = threshold?.minimumTemperature;
      this.minTemperatureDisplay = this.formatTemperatureDisplay(this.minTemperature);
      this.maxTemperature = threshold?.maximumTemperature;
      this.maxTemperatureDisplay = this.formatTemperatureDisplay(this.maxTemperature);
      this.setThresholdViolationStatus();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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

  // If the average temperature is set and there is a temperature threshold
  // for the location, check to see if the average temperature is outside the
  // allowed threshold limits.
  private setThresholdViolationStatus(): void {
    const averageTemp = this.averageTemperature();

    if (averageTemp) {
      if (
        (this.minTemperature && averageTemp < this.minTemperature) ||
        (this.maxTemperature && averageTemp > this.maxTemperature)
      ) {
        this.isTemperatureThresholdInViolation = true;
      } else {
        this.isTemperatureThresholdInViolation = false;
      }
    }
  }

  protected displayTemperatureThresholdModal(): void {
    const flowType: TemperatureThresholdModalFlow = 'update-temperature-threshold';
    const updateTemperatureThresholdModal = this.modal.open(TemperatureThresholdModal, {
      width: '400px',
      data: {
        flow: flowType,
        isFahrenheitDisplay: this.isFahrenheitDisplay(),
        minimumTemperature: this.minTemperature,
        maximumTemperature: this.maxTemperature,
      } as ITemperatureThresholdModal,
    });

    this.subscriptions.push(
      updateTemperatureThresholdModal
        .afterClosed()
        .subscribe((result: ITemperatureThresholdModalLimits) => {
          if (result && (result.minimumTemperature || result.maximumTemperature)) {
            // Update the temperature threshold value(s) in the database.
            this.updateTemperatureThreshold(result);
          }
        }),
    );
  }

  private updateTemperatureThreshold(thresholdLimits: ITemperatureThresholdModalLimits): void {
    const id = this.temperatureThreshold()?.id;
    const locationId = this.temperatureThreshold()?.locationId;

    if (id && locationId) {
      const newThreshold: ITemperatureThreshold = {
        id,
        minimumTemperature: thresholdLimits.minimumTemperature,
        maximumTemperature: thresholdLimits.maximumTemperature,
        locationId,
      };

      this.entityStore.updateTemperatureThreshold(newThreshold);
    }
  }

  protected deleteTemperatureThresholdConfirmation = (): void => {
    const thresholdId = this.temperatureThreshold()?.id;
    const locationId = this.temperatureThreshold()?.locationId;

    if (thresholdId && locationId) {
      const deleteTemperatureThresholdConfirmationActions: IModalActions = {
        primaryAction: () => {
          this.entityStore.deleteTemperatureThreshold({
            id: thresholdId,
            locationId,
          });
        },
      };

      // Display the delete temperature threshold confirmation modal.
      this.modalService.showModalElement(
        DELETE_TEMPERATURE_THRESHOLD_CONFIRMATION_MODAL,
        deleteTemperatureThresholdConfirmationActions,
      );
    }
  };
}
