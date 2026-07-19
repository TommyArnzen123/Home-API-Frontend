import { Component, Input } from '@angular/core';
import { IconElement } from '../shared/components/icon-element/icon-element';

@Component({
  selector: 'item-totals',
  imports: [IconElement],
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
