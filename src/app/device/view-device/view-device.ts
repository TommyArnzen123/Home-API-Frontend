import { Component, inject, OnInit, computed, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ModalService } from '../../services/modal';
import { BreadcrumbService } from '../../services/breadcrumb';
import { RouterService } from '../../services/router';
import { IModalActions } from '../../model/modal';
import { VIEW_DEVICE_INVALID_DEVICE_ID_ERROR_MODAL } from '../../constants/error-constants';
import { DELETE_DEVICE_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';
import { EntityActions, EntityStore } from '../../store/entity.store';

@Component({
  selector: 'view-device',
  imports: [MatButton, MatIcon, DatePipe, DecimalPipe],
  templateUrl: './view-device.html',
  styleUrl: './view-device.scss',
})
export class ViewDevice implements OnInit {
  private readonly entityStore = inject(EntityStore);

  protected deviceId = signal<number | null>(null);
  private locationId: number | null = null;

  protected deviceInfo = computed(() => {
    const deviceId = this.deviceId();

    if (!deviceId) {
      return null;
    } else {
      return this.entityStore.devices()[deviceId];
    }
  });

  protected deviceName = computed(() => {
    if (this.deviceInfo()) {
      return this.deviceInfo()?.details?.deviceName;
    } else {
      return null;
    }
  });

  protected mostRecentTemperature = computed(() => {
    if (this.deviceInfo()) {
      return this.deviceInfo()?.details?.temperature;
    } else {
      return null;
    }
  });

  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);
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
        VIEW_DEVICE_INVALID_DEVICE_ID_ERROR_MODAL,
        viewDeviceInvalidDeviceIDErrorActions,
      );
      this.deviceId.set(null);
    } else {
      this.deviceId.set(id);
      this.breadcrumbService.updatePageInFocus('view-device');

      this.setSuccessEffects();
      this.setErrorEffects();
    }
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
      const error: EntityActions = this.entityStore.errorNotification();

      if (error === 'get-view-device-info') {
        this.viewLocationById();
      }
    });
  }

  ngOnInit(): void {
    const deviceId = this.deviceId();
    if (deviceId) {
      this.entityStore.setSelectedEntity({ type: 'DEVICE', id: deviceId });
      this.entityStore.getViewDeviceInfo(deviceId);
    }
  }

  protected deleteDeviceConfirmation(): void {
    const deviceId = this.deviceId();
    if (deviceId) {
      const deleteDeviceConfirmationActions: IModalActions = {
        primaryAction: () => {
          this.locationId = this.deviceInfo()?.parentId ?? null;
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
    if (this.locationId !== null) {
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
  // protected generateHourlyTemperatureReadings(): IAverageTemperatureByHour[] {
  //   const currentDate = new Date();
  //   const currentHour = currentDate.getHours();

  //   const formattedAverageTemperaturesByHour: IAverageTemperatureByHour[] = [];

  //   const startingIndex = currentHour < 23 ? currentHour + 1 : 0;

  //   for (let i = startingIndex; i <= 23; i++) {
  //     if (averageTempInfo[i] && averageTempInfo[i].hour === i) {
  //       formattedAverageTemperaturesByHour.push(averageTempInfo[i]);
  //     }
  //   }

  //   if (startingIndex !== 0) {
  //     for (let i = 0; i < startingIndex; i++) {
  //       if (averageTempInfo[i] && averageTempInfo[i].hour === i) {
  //         formattedAverageTemperaturesByHour.push(averageTempInfo[i]);
  //       }
  //     }
  //   }

  //   return formattedAverageTemperaturesByHour;
  // }

  // private insertAverageTemperatureByHourInformation(tempInfo: IAverageTemperatureByHour[]): void {
  //   for (let i = 0; i < tempInfo.length; i++) {
  //     averageTempInfo[tempInfo[i].hour].averageTemperature = tempInfo[i].averageTemperature;
  //     averageTempInfo[tempInfo[i].hour].temperatureAvailable = true;
  //   }
  // }
}
