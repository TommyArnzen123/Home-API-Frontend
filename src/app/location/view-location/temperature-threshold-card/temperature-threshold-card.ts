import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Input,
  OnDestroy,
  Output,
  Signal,
} from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { DecimalPipe } from '@angular/common';
import {
  IDeleteTemperatureThresholdRequest,
  ITemperatureThreshold,
  ITemperatureThresholdRequest,
} from '../../../model/temperature-threshold';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import {
  ITemperatureThresholdModalLimits,
  TemperatureThresholdModal,
  TemperatureThresholdModalFlow,
} from '../temperature-threshold-modal/temperature-threshold-modal';
import { MatDialog } from '@angular/material/dialog';
import { TemperatureThresholdService } from '../../../services/temperature-threshold';
import { IUser } from '../../../model/login';
import { LoginService } from '../../../services/login';
import { ModalService } from '../../../services/modal';
import {
  DELETE_TEMPERATURE_THRESHOLD_ERROR_MODAL,
  UPDATE_TEMPERATURE_THRESHOLD_ERROR_MODAL,
} from '../../../constants/error-constants';
import { IModalActions } from '../../../model/modal';
import { DELETE_TEMPERATURE_THRESHOLD_CONFIRMATION_MODAL } from '../../../constants/dialog-confirmation-constants';
import { MatIcon } from '@angular/material/icon';
import { DELETE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL } from '../../../constants/delete-constants';
import { UPDATE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL } from '../../../constants/success-constants';

@Component({
  selector: 'temperature-threshold-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions, MatButton, MatIcon, DecimalPipe],
  templateUrl: './temperature-threshold-card.html',
  styleUrl: './temperature-threshold-card.scss',
})
export class TemperatureThresholdCard implements OnDestroy {
  private subscriptions: Subscription[] = [];

  private user: Signal<IUser | null>;

  private readonly modal = inject(MatDialog);
  private readonly loginService = inject(LoginService);
  private readonly temperatureThresholdService = inject(TemperatureThresholdService);
  private readonly modalService = inject(ModalService);

  @Input({ required: true }) averageTemperature!: number | null;
  temperatureThreshold = input.required<ITemperatureThreshold | null>();
  protected minTemperature: number | null | undefined = null;
  protected maxTemperature: number | null | undefined = null;
  protected isTemperatureThresholdInViolation: boolean = false;
  @Output() thresholdUpdated = new EventEmitter<ITemperatureThreshold | null>();

  constructor() {
    this.user = this.loginService.getUserLoginInfo();

    effect(() => {
      const threshold: ITemperatureThreshold | null = this.temperatureThreshold();
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
    const jwtToken = this.user()?.jwtToken || undefined;

    if (id && locationId && jwtToken) {
      const newThreshold: ITemperatureThresholdRequest = {
        id,
        minimumTemperature: thresholdLimits.minimumTemperature,
        maximumTemperature: thresholdLimits.maximumTemperature,
        locationId,
        jwtToken,
      };

      // Update the temperature threshold in the database.
      this.temperatureThresholdService.updateTemperatureThreshold(newThreshold).subscribe({
        next: () => {
          this.modalService.showModalElement(UPDATE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL);

          this.temperatureThresholdUpdated({
            id: newThreshold.id,
            minimumTemperature: newThreshold.minimumTemperature,
            maximumTemperature: newThreshold.maximumTemperature,
            locationId: newThreshold.locationId,
          } as ITemperatureThreshold);
        },
        error: () => {
          // There was an error updating the temperature threshold.
          this.modalService.showModalElement(UPDATE_TEMPERATURE_THRESHOLD_ERROR_MODAL);
        },
      });
    }
  }

  private temperatureThresholdUpdated(threshold: ITemperatureThreshold): void {
    this.thresholdUpdated.emit(threshold);
  }

  protected deleteTemperatureThresholdConfirmation(): void {
    const deleteTemperatureThresholdConfirmationActions: IModalActions = {
      primaryAction: () => {
        this.deleteTemperatureThreshold();
      },
    };

    // Display the delete temperature threshold confirmation modal.
    this.modalService.showModalElement(
      DELETE_TEMPERATURE_THRESHOLD_CONFIRMATION_MODAL,
      deleteTemperatureThresholdConfirmationActions,
    );
  }

  private deleteTemperatureThreshold(): void {
    const thresholdId: number | undefined = this.temperatureThreshold()?.id;
    const jwtToken = this.user()?.jwtToken || undefined;

    if (thresholdId && jwtToken) {
      const deleteTemperatureThresholdRequest: IDeleteTemperatureThresholdRequest = {
        thresholdId,
        jwtToken,
      };

      this.temperatureThresholdService
        .deleteTemperatureThreshold(deleteTemperatureThresholdRequest)
        .subscribe({
          next: () => {
            this.modalService.showModalElement(DELETE_TEMPERATURE_THRESHOLD_SUCCESS_MODAL);

            // The temperature threshold has been deleted, emit a notification to the parent component.
            this.thresholdUpdated.emit(null);
          },
          error: () => {
            // There was an error deleting the temperature threshold.
            this.modalService.showModalElement(DELETE_TEMPERATURE_THRESHOLD_ERROR_MODAL);
          },
        });
    }
  }
}
