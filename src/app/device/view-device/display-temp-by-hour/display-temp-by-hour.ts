import { Component, computed, effect, input, Signal } from '@angular/core';
import { MatCard } from '@angular/material/card';
import {
  addTemperatureSymbol,
  fahrenheitToCelsius,
} from '../../../shared/utility/temperature-utility';
import { IconElement } from '../../../shared/components/icon-element/icon-element';

enum BackgroundDisplayOptions {
  'HOT' = 'HOT',
  'TEMPERATE' = 'TEMPERATE',
  'COLD' = 'COLD',
  'NONE' = 'NONE',
}

@Component({
  selector: 'display-temp-by-hour',
  imports: [MatCard, IconElement],
  templateUrl: './display-temp-by-hour.html',
  styleUrl: './display-temp-by-hour.scss',
})
export class DisplayTempByHour {
  hour = input.required<number>();
  temperature = input.required<number | null>();
  is12HourTimeDisplay = input.required<boolean>();
  isFahrenheitDisplay = input.required<boolean>();
  protected currentHour: number;

  protected hourDisplay = computed(() => {
    const hour = this.hour();
    if (this.is12HourTimeDisplay()) {
      return this.format12HourTimeDisplay(hour);
    } else {
      return String(hour);
    }
  });

  protected temperatureDisplay = computed(() => {
    const temp = this.temperature();
    if (temp) {
      return this.formatTemperatureDisplay(temp);
    } else {
      return undefined;
    }
  });

  private format12HourTimeDisplay(hour: number): string {
    const formatted12HourTime = hour % 12 || 12;
    const amPm = hour >= 12 ? 'PM' : 'AM';
    return formatted12HourTime + ' ' + amPm;
  }

  private formatTemperatureDisplay(originalTemp: number | undefined): string {
    let temp = '';
    if (originalTemp && !this.isFahrenheitDisplay()) {
      temp = fahrenheitToCelsius(originalTemp);
    } else if (originalTemp && this.isFahrenheitDisplay()) {
      temp = String(originalTemp);
    }

    return addTemperatureSymbol(temp, this.isFahrenheitDisplay());
  }

  protected backgroundDisplayStyle: Signal<BackgroundDisplayOptions> = computed(() => {
    const temp = this.temperature();
    if (temp !== null) {
      if (temp > 80) {
        return BackgroundDisplayOptions.HOT;
      } else if (temp <= 80 && temp >= 60) {
        return BackgroundDisplayOptions.TEMPERATE;
      } else {
        return BackgroundDisplayOptions.COLD;
      }
    }

    return BackgroundDisplayOptions.NONE;
  });

  constructor() {
    const currentDate = new Date();
    this.currentHour = currentDate.getHours();
  }
}
