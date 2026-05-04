import { Component, Inject, OnInit, OnDestroy, inject } from '@angular/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ModalService } from '../../../services/modal';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

export type TemperatureThresholdModalFlow =
  | 'add-temperature-threshold'
  | 'update-temperature-threshold';

export interface ITemperatureThresholdModalLimits {
  minimumTemperature: number | undefined;
  maximumTemperature: number | undefined;
}

interface ITemperatureThresholdModal extends ITemperatureThresholdModalLimits {
  flow: TemperatureThresholdModalFlow;
}

@Component({
  selector: 'temperature-threshold-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatFormField,
    MatInput,
    MatError,
    ReactiveFormsModule,
  ],
  templateUrl: './temperature-threshold-modal.html',
  styleUrl: './temperature-threshold-modal.scss',
})
export class TemperatureThresholdModal implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly modalService = inject(ModalService);

  protected flow: TemperatureThresholdModalFlow = 'add-temperature-threshold';
  protected title: string = 'Add Temperature Threshold';
  protected primaryButtonText: string = 'Add';
  private minimumTemperature: number | undefined = undefined;
  private maximumTemperature: number | undefined = undefined;

  protected form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ITemperatureThresholdModal,
    private readonly modal: MatDialogRef<TemperatureThresholdModal>,
  ) {
    this.flow = this.data.flow;
    this.minimumTemperature = this.data.minimumTemperature;
    this.maximumTemperature = this.data.maximumTemperature;

    if (this.flow === 'add-temperature-threshold') {
      this.title = 'Add Temperature Threshold';
      this.primaryButtonText = 'Add';
    } else if (this.flow === 'update-temperature-threshold') {
      this.title = 'Update Temperature Threshold';
      this.primaryButtonText = 'Update';
    }
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      minimumTemperature: new FormControl(this.minimumTemperature, [numericValidator()]),
      maximumTemperature: new FormControl(this.maximumTemperature, [numericValidator()]),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // Validate the temperature threshold form.
  protected primaryAction(): void {
    console.log('Primary button clicked - validating form.');

    this.form.markAllAsTouched();

    if (this.form.valid) {
      const minTemp: number | undefined = this.form.get('minimumTemperature')?.value || undefined;
      const maxTemp: number | undefined = this.form.get('maximumTemperature')?.value || undefined;

      if (minTemp || maxTemp) {
        // Close the modal and pass the temperature threshold information back to the parent component.
        this.closeModal({
          minimumTemperature: minTemp,
          maximumTemperature: maxTemp,
        } as ITemperatureThresholdModalLimits);
      }
    }
  }

  protected cancelAction(): void {
    this.closeModal(null);
  }

  private closeModal(thresholdValues: ITemperatureThresholdModalLimits | null): void {
    this.modal.close(thresholdValues);
  }
}

export function numericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === '') {
      return null;
    }

    // Check if the value is a number.
    const isNumber = !isNaN(parseFloat(value)) && isFinite(value);

    console.log(isNumber);

    return isNumber ? null : { numberViolation: true };
  };
}
