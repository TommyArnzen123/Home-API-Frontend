import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'home-item-totals',
  imports: [MatIcon],
  templateUrl: './item-totals.html',
  styleUrl: './item-totals.scss',
})
export class ItemTotals {
  @Input({required: true}) displayTotalHomes!: boolean;
  @Input({ required: false }) totalHomes!: number;
  @Input({required: true}) displayTotalLocations!: boolean;
  @Input({ required: false }) totalLocations!: number;
  @Input({required: true}) displayTotalDevices!: boolean;
  @Input({ required: false }) totalDevices!: number;
}
