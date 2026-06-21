import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  effect,
  computed,
  Signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal';
import { RouterService } from '../../services/router';
import { TemperatureThresholdCard } from './temperature-threshold-card/temperature-threshold-card';
import { DeviceCard } from './device-card/device-card';
import { IModalActions } from '../../model/modal';
import { INVALID_LOCATION_ID_ERROR_MODAL } from '../../constants/error-constants';
import { DELETE_LOCATION_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';
import { MatDialog } from '@angular/material/dialog';
import {
  ITemperatureThresholdModalLimits,
  TemperatureThresholdModal,
  TemperatureThresholdModalFlow,
} from './temperature-threshold-modal/temperature-threshold-modal';
import { DeviceData, EntityActions, EntityStore } from '../../store/entity.store';
import { setAverageTemperature } from '../../shared/utility/temperature-utility';

@Component({
  selector: 'view-location',
  imports: [MatButton, MatIcon, DeviceCard, TemperatureThresholdCard, DecimalPipe],
  templateUrl: './view-location.html',
  styleUrl: './view-location.scss',
})
export class ViewLocation implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private entityStore = inject(EntityStore);

  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);
  private readonly modal = inject(MatDialog);

  protected locationId = signal<number | null>(null);
  protected averageTemperature = computed(() => setAverageTemperature(this.deviceInfo()));
  protected temperatureThreshold = computed(() => this.locationInfo()?.details?.threshold);

  protected locationInfo = computed(() => {
    const locationId = this.locationId();

    if (!locationId) {
      return null;
    } else {
      return this.entityStore.locations()[locationId];
    }
  });
  protected locationName = computed(() => this.locationInfo()?.details?.locationName);
  private homeId: number | null = null;

  protected readonly deviceInfo: Signal<DeviceData[]> = computed(() =>
    Object.values(this.entityStore.devices()),
  );

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('locationId'));

    if (isNaN(id)) {
      // If the value provided for the locationId is not a number, route the user away
      // from the view location page.
      const viewLocationInvalidLocationIDErrorActions: IModalActions = {
        primaryAction: () => this.viewHomeById(),
      };
      this.modalService.showModalElement(
        INVALID_LOCATION_ID_ERROR_MODAL,
        viewLocationInvalidLocationIDErrorActions,
      );
      this.locationId.set(null);
    } else {
      this.locationId.set(id);
      this.setSuccessEffects();
      this.setErrorEffects();
    }
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: EntityActions = this.entityStore.successNotification();

      if (success === 'delete-location') {
        this.viewHomeById(); // Route the user to the view home component.
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: EntityActions | undefined = this.entityStore.errorNotification()?.errorAction;

      if (error === 'get-view-location-info') {
        this.viewHomeById();
      }
    });
  }

  ngOnInit(): void {
    this.entityStore.setPageMode('VIEW');

    const locationId = this.locationId();
    if (locationId) {
      this.entityStore.getViewLocationInfo(locationId);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected viewRegisterDevicePage(): void {
    const locationId = this.locationId();
    if (locationId !== null) {
      this.routerService.viewRegisterDevicePage(locationId);
    }
  }

  private viewHomeById(): void {
    if (this.homeId) {
      this.routerService.viewHomeById(this.homeId);
    } else {
      // The home ID value is not set, route to the homescreen.
      this.viewHomescreen();
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  protected deleteLocationConfirmation(): void {
    const locationId = this.locationId();
    if (locationId) {
      const deleteLocationConfirmationActions: IModalActions = {
        primaryAction: () => {
          this.homeId = this.locationInfo()?.parentId ?? null;
          this.entityStore.deleteLocation(locationId);
        },
      };

      this.modalService.showModalElement(
        DELETE_LOCATION_CONFIRMATION_MODAL,
        deleteLocationConfirmationActions,
      );
    }
  }

  protected displayTemperatureThresholdModal(): void {
    const flowType: TemperatureThresholdModalFlow = 'add-temperature-threshold';
    const addTemperatureThresholdModal = this.modal.open(TemperatureThresholdModal, {
      width: '400px',
      data: {
        flow: flowType,
      },
    });

    const locationId = this.locationId();

    if (locationId) {
      this.subscriptions.push(
        addTemperatureThresholdModal
          .afterClosed()
          .subscribe((result: ITemperatureThresholdModalLimits) => {
            if (result && (result.minimumTemperature || result.maximumTemperature)) {
              // Add the new temperature threshold value(s) to the database.
              // this.addTemperatureThreshold(result);
              this.entityStore.addTemperatureThreshold({
                locationId,
                minimumTemperature: result.minimumTemperature,
                maximumTemperature: result.maximumTemperature,
              });
            }
          }),
      );
    }
  }

  protected viewEditLocationPage(): void {
    const locationId = this.locationId();
    if (locationId !== null) {
      this.routerService.viewEditLocationPage(locationId);
    }
  }
}
