import { Component, computed, input } from '@angular/core';
import { MatCard } from '@angular/material/card';
import {
  addTemperatureSymbol,
  fahrenheitToCelsius,
} from '../../../shared/utility/temperature-utility';
import { IconElement } from '../../../shared/components/icon-element/icon-element';

/*
    Temperature styling rules (Fahrenheit):
      - Temp < 60 -> COLD.
      - Temp >= 60 && Temp <= 80 -> TEMPERATE.
      - Temp > 80 -> HOT.
  */
@Component({
  selector: 'hour-display-reference',
  imports: [MatCard, IconElement],
  templateUrl: './hour-display-reference.html',
  styleUrl: './hour-display-reference.scss',
})
export class HourDisplayReference {
  isFahrenheitDisplay = input.required<boolean>();

  // The highest low temperature allowed.
  protected coldHigh = computed(() => this.formatTemperatureDisplay(59));

  // The lowest temperate temperature allowed.
  protected temperateLow = computed(() => this.formatTemperatureDisplay(60));

  // The highest temperate temperature allowed.
  protected temperateHigh = computed(() => this.formatTemperatureDisplay(80));

  // The lowest hot temperature allowed.
  protected hotLow = computed(() => this.formatTemperatureDisplay(81));

  private formatTemperatureDisplay(originalTemp: number): string {
    let temp = '';
    if (this.isFahrenheitDisplay()) {
      temp = String(originalTemp);
    } else {
      temp = fahrenheitToCelsius(originalTemp);
    }

    return addTemperatureSymbol(temp, this.isFahrenheitDisplay());
  }
}
