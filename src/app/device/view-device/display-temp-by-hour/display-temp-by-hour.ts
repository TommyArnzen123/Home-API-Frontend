import { Component, Input } from '@angular/core';

@Component({
  selector: 'display-temp-by-hour',
  imports: [],
  templateUrl: './display-temp-by-hour.html',
  styleUrl: './display-temp-by-hour.scss',
})
export class DisplayTempByHour {
  @Input({ required: true }) hour!: number;
  @Input({ required: true }) temperature!: number;
}
