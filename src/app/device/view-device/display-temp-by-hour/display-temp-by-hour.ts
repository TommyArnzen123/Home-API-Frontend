import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'display-temp-by-hour',
  imports: [DecimalPipe],
  templateUrl: './display-temp-by-hour.html',
  styleUrl: './display-temp-by-hour.scss',
})
export class DisplayTempByHour {
  @Input({ required: true }) hour!: number;
  @Input({ required: true }) temperature!: number;
  @Input({ required: true }) temperatureAvailable!: boolean;
}
