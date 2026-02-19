import { Component, Input } from '@angular/core';

@Component({
  selector: 'home-item-totals',
  imports: [],
  templateUrl: './item-totals.html',
  styleUrl: './item-totals.scss',
})
export class ItemTotals {
  @Input({ required: true }) displayTotalHomes!: boolean;
  @Input({ required: false }) totalHomes!: number;
  @Input({ required: true }) displayTotalLocations!: boolean;
  @Input({ required: false }) totalLocations!: number;
  @Input({ required: true }) displayTotalDevices!: boolean;
  @Input({ required: false }) totalDevices!: number;
}
