import { Component, effect, inject, input, Input, OnDestroy } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { DecimalPipe } from '@angular/common';
import { ITemperatureThreshold } from '../../../model/temperature-threshold';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import {
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

@Component({
  selector: 'temperature-threshold-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions, MatButton, MatIcon, DecimalPipe],
  templateUrl: './temperature-threshold-card.html',
  styleUrl: './temperature-threshold-card.scss',
})
export class TemperatureThresholdCard implements OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly entityStore = inject(EntityStore);

  private readonly modal = inject(MatDialog);
  private readonly modalService = inject(ModalService);

  @Input({ required: true }) averageTemperature!: number | null;
  temperatureThreshold = input.required<ITemperatureThreshold | undefined>();
  protected minTemperature: number | null | undefined = null;
  protected maxTemperature: number | null | undefined = null;
  protected isTemperatureThresholdInViolation: boolean = false;

  constructor() {
    effect(() => {
      const threshold: ITemperatureThreshold | undefined = this.temperatureThreshold();
      this.minTemperature = threshold?.minimumTemperature;
      this.maxTemperature = threshold?.maximumTemperature;
      this.setThresholdViolationStatus();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // If the average temperature is set and there is a temperature threshold
  // for the location, check to see if the average temperature is outside the
  // allowed threshold limits.
  private setThresholdViolationStatus(): void {
    if (this.averageTemperature) {
      if (
        (this.minTemperature && this.averageTemperature < this.minTemperature) ||
        (this.maxTemperature && this.averageTemperature > this.maxTemperature)
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
        minimumTemperature: this.minTemperature,
        maximumTemperature: this.maxTemperature,
      },
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

  protected deleteTemperatureThresholdConfirmation(): void {
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
  }

  private deleteTemperatureThreshold(): void {
    // const thresholdId: number | undefined = this.temperatureThreshold()?.id;
    // if (thresholdId) {
    // this.temperatureThresholdService.deleteTemperatureThreshold(thresholdId).subscribe({
    //   next: () => {
    //     this.modalService.showModalElement(DELETE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL);
    //     // The temperature threshold has been deleted, emit a notification to the parent component.
    //     // this.thresholdUpdated.emit(null);
    //   },
    //   error: () => {
    //     // There was an error deleting the temperature threshold.
    //     this.modalService.showModalElement(DELETE_TEMPERATURE_THRESHOLD_ERROR_MODAL);
    //   },
    // });
    // }
  }
}
