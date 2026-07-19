import { Component, computed, inject, input } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { IModalActions } from '../../../model/modal';
import { DELETE_DEVICE_CONFIRMATION_MODAL } from '../../../constants/dialog-confirmation-constants';
import { DeviceData, EntityStore } from '../../../store/entity.store';
import { TemperatureDisplayOptions } from '../../../model/account-settings';
import {
  addTemperatureSymbol,
  fahrenheitToCelsius,
} from '../../../shared/utility/temperature-utility';
import { DeleteButtonElement } from '../../../shared/components/button-element/delete-button-element';

@Component({
  selector: 'device-card',
  imports: [MatButton, MatCard, MatCardHeader, MatCardTitle, MatCardActions, DeleteButtonElement],
  templateUrl: './device-card.html',
  styleUrl: './device-card.scss',
})
export class DeviceCard {
  private readonly entityStore = inject(EntityStore);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  private isFahrenheitDisplay = computed(
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

  deviceInfo = input.required<DeviceData>();

  protected averageTemperatureDisplay = computed(() => {
    let averageTemp: number | undefined = undefined;

    if (
      this.deviceInfo() &&
      this.deviceInfo().summary &&
      this.deviceInfo().summary.temperature &&
      this.deviceInfo().summary.temperature.temperature
    ) {
      averageTemp = this.deviceInfo().summary.temperature.temperature;
    }

    return this.formatTemperatureDisplay(averageTemp);
  });

  protected viewDeviceById(): void {
    if (this.deviceInfo && this.deviceInfo().entityId) {
      this.routerService.viewDeviceById(this.deviceInfo().entityId);
    }
  }

  protected deleteDeviceConfirmation = (): void => {
    if (this.deviceInfo && this.deviceInfo().entityId) {
      const deleteDeviceConfirmationActions: IModalActions = {
        primaryAction: () => this.entityStore.deleteDevice(this.deviceInfo().entityId),
      };

      this.modalService.showModalElement(
        DELETE_DEVICE_CONFIRMATION_MODAL,
        deleteDeviceConfirmationActions,
      );
    }
  };
}
