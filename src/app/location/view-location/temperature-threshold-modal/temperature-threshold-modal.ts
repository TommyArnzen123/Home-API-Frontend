import { Component, Inject, OnInit, OnDestroy, signal } from '@angular/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  minMaxValidator,
  numericValidator,
  updatedValueValidator,
  valueEnteredValidator,
} from './temperature-threshold-modal-validators';
import { fahrenheitToCelsius } from '../../../shared/utility/temperature-utility';

export type TemperatureThresholdModalFlow =
  | 'add-temperature-threshold'
  | 'update-temperature-threshold';

export interface ITemperatureThresholdModalLimits {
  minimumTemperature: number | undefined;
  maximumTemperature: number | undefined;
}

export interface ITemperatureThresholdModal extends ITemperatureThresholdModalLimits {
  flow: TemperatureThresholdModalFlow;
  isFahrenheitDisplay: boolean;
}

type TemperatureThresholdTypes = 'minimum' | 'maximum';

@Component({
  selector: 'temperature-threshold-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatLabel,
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

  protected flow: TemperatureThresholdModalFlow = 'add-temperature-threshold';
  protected isFahrenheitDisplay: boolean = true;
  protected title: string = 'Add Temperature Threshold';
  protected primaryButtonText: string = 'Add';
  protected minimumTemperatureLabel = signal<string>('Minimum Temperature');
  protected maximumTemperatureLabel = signal<string>('Maximum Temperature');
  private minimumTemperature: number | undefined = undefined;
  private minimumTemperatureDisplay: number | undefined = undefined;
  private maximumTemperature: number | undefined = undefined;
  private maximumTemperatureDisplay: number | undefined = undefined;

  protected addButtonClicked = false;

  protected form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ITemperatureThresholdModal,
    private readonly modal: MatDialogRef<TemperatureThresholdModal>,
  ) {
    this.flow = this.data.flow;
    this.isFahrenheitDisplay = this.data.isFahrenheitDisplay;
    console.log(this.isFahrenheitDisplay);
    this.minimumTemperature = this.data.minimumTemperature;

    this.minimumTemperatureLabel.set(this.getTempDisplayLabel('minimum', this.isFahrenheitDisplay));

    if (this.minimumTemperature) {
      this.minimumTemperatureDisplay = this.isFahrenheitDisplay
        ? this.minimumTemperature
        : Number(fahrenheitToCelsius(this.minimumTemperature));
    }
    this.maximumTemperature = this.data.maximumTemperature;
    this.maximumTemperatureLabel.set(this.getTempDisplayLabel('maximum', this.isFahrenheitDisplay));
    if (this.maximumTemperature) {
      this.maximumTemperatureDisplay = this.isFahrenheitDisplay
        ? this.maximumTemperature
        : Number(fahrenheitToCelsius(this.maximumTemperature));
    }

    if (this.flow === 'add-temperature-threshold') {
      this.title = 'Add Temperature Threshold';
      this.primaryButtonText = 'Add';
    } else if (this.flow === 'update-temperature-threshold') {
      this.title = 'Update Temperature Threshold';
      this.primaryButtonText = 'Update';
    }
  }

  private getTempDisplayLabel(
    tempType: TemperatureThresholdTypes,
    isFahrenheitDisplay: boolean,
  ): string {
    let thresholdLabel = '';

    thresholdLabel = tempType === 'minimum' ? 'Minimum Temperature' : 'Maximum Temperature';
    thresholdLabel += isFahrenheitDisplay ? ' (Fahrenheit)' : ' (Celsius)';
    return thresholdLabel;
  }

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        minimumTemperature: new FormControl(this.minimumTemperatureDisplay, [numericValidator()]),
        maximumTemperature: new FormControl(this.maximumTemperatureDisplay, [numericValidator()]),
      },
      [
        minMaxValidator(),
        valueEnteredValidator(),
        updatedValueValidator(this.flow, this.minimumTemperature, this.maximumTemperature),
      ],
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // Validate the temperature threshold form.
  protected primaryAction(): void {
    this.addButtonClicked = true;
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const minTemp: number | undefined = this.form.get('minimumTemperature')?.value ?? undefined;
      const maxTemp: number | undefined = this.form.get('maximumTemperature')?.value ?? undefined;

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
