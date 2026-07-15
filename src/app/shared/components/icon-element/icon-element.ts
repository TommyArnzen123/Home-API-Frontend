import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ICON_REFERENCE_KEYS } from '../../../constants/icon-registry';

@Component({
  selector: 'icon-element',
  imports: [MatIcon],
  templateUrl: './icon-element.html',
  styleUrl: './icon-element.scss',
})
export class IconElement {
  src = input.required<ICON_REFERENCE_KEYS>(); // The name of the registered icon.
  width = input.required<number>(); // The explicit width to be applied.
  height = input.required<number>(); // The explicit height to be applied.
  alt = input.required<string>(); // The alt text to be applied.
}
