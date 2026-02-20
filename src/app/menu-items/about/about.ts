import { Component } from '@angular/core';
import { ICON_REFERENCES } from '../../constants/icon-reference-constants';

@Component({
  selector: 'about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly iconReferences = ICON_REFERENCES;
}
