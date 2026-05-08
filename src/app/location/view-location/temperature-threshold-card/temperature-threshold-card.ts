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
import { LoginService } from '../../../services/login';
import { ModalService } from '../../../services/modal';
import {
  DELETE_TEMPERATURE_THRESHOLD_ERROR_MODAL,
  UPDATE_TEMPERATURE_THRESHOLD_ERROR_MODAL,
} from '../../../constants/error-constants';
import { IModalActions } from '../../../model/modal';
import { DELETE_TEMPERATURE_THRESHOLD_CONFIRMATION_MODAL } from '../../../constants/dialog-confirmation-constants';
import { MatIcon } from '@angular/material/icon';
import { UPDATE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL } from '../../../constants/success-constants';
import { ViewLocationActions, ViewLocationStore } from '../view-location.store';
import { isThresholdViolated } from '../../../shared/utility/temperature-utility';

@Component({
  selector: 'temperature-threshold-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions, MatButton, MatIcon, DecimalPipe],
  templateUrl: './temperature-threshold-card.html',
  styleUrl: './temperature-threshold-card.scss',
})
export class TemperatureThresholdCard implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private readonly viewLocationStore = inject(ViewLocationStore);
  private readonly modal = inject(MatDialog);
  private readonly loginService = inject(LoginService);
  private readonly modalService = inject(ModalService);

  @Input({ required: true }) averageTemperature!: number | null;
  temperatureThreshold = input.required<ITemperatureThreshold | null>();
  protected minTemperature: number | null | undefined = null;
  protected maxTemperature: number | null | undefined = null;
  protected isTemperatureThresholdInViolation: boolean = false;

  constructor() {
    this.setSuccessEffects();
    this.setErrorEffects();
    this.setGeneralEffects();
  }

  private setGeneralEffects(): void {
    effect(() => {
      const threshold: ITemperatureThreshold | null = this.temperatureThreshold();
      this.minTemperature = threshold?.minimumTemperature;
      this.maxTemperature = threshold?.maximumTemperature;
      this.setThresholdViolationStatus();
    });
  }

  private setSuccessEffects(): void {
    const modalActions: IModalActions = {
      primaryAction: () => this.viewLocationStore.resetNotificationState(),
    };

    effect(() => {
      const success: ViewLocationActions = this.viewLocationStore.successNotification();

      if (success === 'update-threshold') {
        this.modalService.showModalElement(
          UPDATE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL,
          modalActions,
        );
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: ViewLocationActions = this.viewLocationStore.errorNotification();

      if (error === 'update-threshold') {
        this.modalService.showModalElement(UPDATE_TEMPERATURE_THRESHOLD_ERROR_MODAL);
      }

      if (error === 'delete-threshold') {
        this.modalService.showModalElement(DELETE_TEMPERATURE_THRESHOLD_ERROR_MODAL);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // If set, check to see if the average temperature violates the temperature threshold.
  private setThresholdViolationStatus(): void {
    if (this.averageTemperature) {
      this.isTemperatureThresholdInViolation = isThresholdViolated(
        this.averageTemperature,
        this.minTemperature,
        this.maxTemperature,
      );
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
            this.viewLocationStore.updateTemperatureThreshold({
              minimumTemperature: result.minimumTemperature,
              maximumTemperature: result.maximumTemperature,
            });
          }
        }),
    );
  }

  protected deleteTemperatureThresholdConfirmation(): void {
    const deleteTemperatureThresholdConfirmationActions: IModalActions = {
      primaryAction: () => {
        this.viewLocationStore.deleteTemperatureThreshold();
      },
    };

    // Display the delete temperature threshold confirmation modal.
    this.modalService.showModalElement(
      DELETE_TEMPERATURE_THRESHOLD_CONFIRMATION_MODAL,
      deleteTemperatureThresholdConfirmationActions,
    );
  }
}
