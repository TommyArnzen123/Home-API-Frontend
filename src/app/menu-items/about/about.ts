import { Component } from '@angular/core';
import { ICON_REFERENCES } from '../../constants/icon-reference-constants';
import { IconElement } from '../../shared/components/icon-element/icon-element';

@Component({
  selector: 'about',
  imports: [IconElement],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly iconReferences = ICON_REFERENCES;
}
