import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

type temperatureTypes = 'fahrenheit' | 'celsius';
type timeTypes = '12' | '24';
type colorModeTypes = 'light' | 'dark';

@Component({
  selector: 'settings',
  imports: [MatButtonToggleModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  protected temperatureSetting: temperatureTypes = 'fahrenheit';
  protected timeSetting: timeTypes = '24';
  protected colorModeSetting: colorModeTypes = 'light';
}
