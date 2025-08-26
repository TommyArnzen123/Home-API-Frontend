import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'home-item-totals',
  imports: [MatIcon],
  templateUrl: './item-totals.html',
  styleUrl: './item-totals.scss',
})
export class ItemTotals {
  @Input({ required: true }) totalHomes!: number;
  @Input({ required: true }) totalLocations!: number;
  @Input({ required: true }) totalDevices!: number;
}
