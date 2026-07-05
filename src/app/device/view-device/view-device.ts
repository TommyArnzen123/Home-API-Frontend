import { Component, inject, OnInit, computed, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ModalService } from '../../services/modal';
import { RouterService } from '../../services/router';
import { IModalActions } from '../../model/modal';
import { INVALID_DEVICE_ID_ERROR_MODAL } from '../../constants/error-constants';
import { DELETE_DEVICE_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';
import { EntityActions, EntityStore } from '../../store/entity.store';
import { DisplayTempByHour } from './display-temp-by-hour/display-temp-by-hour';
import { IAverageTemperatureByHour } from '../../model/get-info';
import { TemperatureDisplayOptions, TimeDisplayOptions } from '../../model/account-settings';
import {
  addTemperatureSymbol,
  fahrenheitToCelsius,
} from '../../shared/utility/temperature-utility';

@Component({
  selector: 'view-device',
  imports: [MatButton, MatIcon, DatePipe, DisplayTempByHour],
  templateUrl: './view-device.html',
  styleUrl: './view-device.scss',
})
export class ViewDevice implements OnInit {
  private readonly entityStore = inject(EntityStore);

  protected deviceId = signal<number | undefined>(undefined);
  private locationId: number | undefined = undefined;

  protected deviceInfo = computed(() => {
    const deviceId = this.deviceId();

    if (!deviceId) {
      return undefined;
    } else {
      return this.entityStore.devices()[deviceId];
    }
  });

  protected deviceName = computed(() => {
    if (this.deviceInfo()) {
      return this.deviceInfo()?.details?.deviceName;
    } else {
      return undefined;
    }
  });

  protected mostRecentTemperature = computed(() => {
    if (this.deviceInfo()) {
      return this.deviceInfo()?.details?.temperature;
    } else {
      return undefined;
    }
  });

  protected is12HourTimeDisplay = computed(
    () => this.entityStore.accountSettings()?.timeDisplaySetting === TimeDisplayOptions.HOUR_12,
  );

  protected isFahrenheitDisplay = computed(
    () =>
      this.entityStore.accountSettings()?.temperatureDisplaySetting ===
      TemperatureDisplayOptions.FAHRENHEIT,
  );

  formatTemperatureDisplay(originalTemp: number | undefined): string {
    let temp = '';
    if (originalTemp && !this.isFahrenheitDisplay()) {
      temp = fahrenheitToCelsius(originalTemp);
    } else if (originalTemp && this.isFahrenheitDisplay()) {
      temp = String(originalTemp);
    }

    return addTemperatureSymbol(temp, this.isFahrenheitDisplay());
  }

  protected mostRecentTemperatureDisplay = computed(() => {
    const temp = this.mostRecentTemperature()?.temperature;
    if (temp) {
      return this.formatTemperatureDisplay(temp);
    } else {
      return undefined;
    }
  });

  protected averageTemperaturesByHour = computed(() => {
    if (this.deviceInfo()) {
      return this.deviceInfo()?.details?.averageTemperaturesByHourCurrentDate;
    } else {
      return undefined;
    }
  });

  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(ModalService);
  private readonly routerService = inject(RouterService);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('deviceId'));

    if (isNaN(id)) {
      // If the value provided for the deviceId is not a number, route the user away
      // from the view device page.
      const viewDeviceInvalidDeviceIDErrorActions: IModalActions = {
        primaryAction: () => this.viewLocationById(),
      };
      this.modalService.showModalElement(
        INVALID_DEVICE_ID_ERROR_MODAL,
        viewDeviceInvalidDeviceIDErrorActions,
      );
      this.deviceId.set(undefined);
    } else {
      this.deviceId.set(id);
      this.setSuccessEffects();
      this.setErrorEffects();
    }

    effect(() => {
      this.mostRecentTemperatureDisplay();
    });
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: EntityActions = this.entityStore.successNotification();

      if (success === 'delete-device') {
        this.viewLocationById(); // Route the user to the view location component.
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: EntityActions | undefined = this.entityStore.errorNotification()?.errorAction;

      if (error === 'get-view-device-info') {
        this.viewLocationById();
      }
    });
  }

  ngOnInit(): void {
    this.entityStore.setPageMode('VIEW');

    const deviceId = this.deviceId();
    if (deviceId) {
      this.entityStore.getViewDeviceInfo(deviceId);
    }
  }

  protected deleteDeviceConfirmation(): void {
    const deviceId = this.deviceId();
    if (deviceId) {
      const deleteDeviceConfirmationActions: IModalActions = {
        primaryAction: () => {
          this.locationId = this.deviceInfo()?.parentId ?? undefined;
          this.entityStore.deleteDevice(deviceId);
        },
      };

      this.modalService.showModalElement(
        DELETE_DEVICE_CONFIRMATION_MODAL,
        deleteDeviceConfirmationActions,
      );
    }
  }

  private viewLocationById(): void {
    if (this.locationId !== undefined) {
      this.routerService.viewLocationById(this.locationId);
    } else {
      this.viewHomescreen();
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  // Generate an array of average temperature by hour objects
  // with the current hour as the last item in the array.
  protected generateHourlyTemperatureReadings(): IAverageTemperatureByHour[] {
    const formattedAverageTemperaturesByHour: IAverageTemperatureByHour[] = [];

    for (let i = 0; i <= 23; i++) {
      formattedAverageTemperaturesByHour.push({
        hour: i,
        averageTemperature: null,
      });
    }

    this.averageTemperaturesByHour()?.forEach((temp) => {
      formattedAverageTemperaturesByHour[temp.hour].averageTemperature = temp.averageTemperature;
    });

    const currentHour = new Date().getHours();
    const startingHourlyIndex = currentHour < 23 ? currentHour + 1 : 0;

    return formattedAverageTemperaturesByHour
      .slice(startingHourlyIndex)
      .concat(formattedAverageTemperaturesByHour.slice(0, startingHourlyIndex))
      .reverse();
  }

  protected viewEditDevicePage(): void {
    const deviceId = this.deviceId();
    if (deviceId !== undefined) {
      this.routerService.viewEditDevicePage(deviceId);
    }
  }
}
