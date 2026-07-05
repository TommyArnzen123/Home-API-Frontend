import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonToggleChange,
  MatButtonToggleGroup,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { EntityActions, EntityStore, ErrorState } from '../../store/entity.store';
import { TemperatureDisplayOptions, TimeDisplayOptions } from '../../model/account-settings';
import { RouterService } from '../../services/router';

@Component({
  selector: 'settings',
  imports: [MatButtonToggleModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  private readonly entityStore = inject(EntityStore);
  private readonly routerService = inject(RouterService);

  protected readonly timeDisplaySetting = computed(
    () => this.entityStore.accountSettings()?.timeDisplaySetting,
  );

  protected readonly temperatureDisplaySetting = computed(
    () => this.entityStore.accountSettings()?.temperatureDisplaySetting,
  );

  constructor() {
    effect(() => {
      console.log(this.timeDisplaySetting());
      console.log(this.temperatureDisplaySetting());
      console.log(this.entityStore.accountSettings());
    });

    this.setErrorEffects();
  }

  ngOnInit(): void {
    this.entityStore.getAccountSettings(); // Fetch the most recent account settings for the account.
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: ErrorState | null = this.entityStore.errorNotification();

      if (error && error?.errorAction === 'get-account-settings') {
        console.log('There was an error getting account settings.');
        this.routerService.viewHomescreen();
      }

      if (error && error?.errorAction === 'update-time-display-setting') {
        console.log('There was an error updating the time display setting.');
      }
    });
  }

  protected updateTemperatureDisplaySetting(
    event: MatButtonToggleChange,
    group: MatButtonToggleGroup,
  ): void {
    console.log('Update temperature display setting.');
    const temperatureDisplayValue: TemperatureDisplayOptions = event.value;

    // Make a network call to update the temperature display setting.
    this.entityStore.updateTemperatureDisplaySetting(temperatureDisplayValue);
    group.value = this.temperatureDisplaySetting();
  }

  protected updateTimeDisplaySetting(
    event: MatButtonToggleChange,
    group: MatButtonToggleGroup,
  ): void {
    console.log('Update time display setting.');
    const timeDisplayValue: TimeDisplayOptions = event.value;

    // Make a network call to update the time display setting.
    this.entityStore.updateTimeDisplaySetting(timeDisplayValue);
    group.value = this.timeDisplaySetting();
  }
}
