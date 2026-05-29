import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'display-temp-by-hour',
  imports: [DecimalPipe, MatCard],
  templateUrl: './display-temp-by-hour.html',
  styleUrl: './display-temp-by-hour.scss',
})
export class DisplayTempByHour {
  @Input({ required: true }) hour!: number;
  @Input({ required: true }) temperature!: number | null;
  protected currentHour: number;

  constructor() {
    const currentDate = new Date();
    this.currentHour = currentDate.getHours();
  }
}
