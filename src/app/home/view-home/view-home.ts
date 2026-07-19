import { Component, inject, effect, signal, computed, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { ModalService } from '../../services/modal';
import { RouterService } from '../../services/router';
import { ItemTotals } from '../../item-totals/item-totals';
import { LocationCard } from './location-card/location-card';
import { IModalActions } from '../../model/modal';
import { INVALID_HOME_ID_ERROR_MODAL } from '../../constants/error-constants';
import { DELETE_HOME_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';
import { EntityActions, EntityStore, LocationData } from '../../store/entity.store';
import { IconElement } from '../../shared/components/icon-element/icon-element';
import { DeleteButtonElement } from '../../shared/components/button-element/delete-button-element';
import { map, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EnvironmentService } from '../../services/environment';

@Component({
  selector: 'view-home',
  imports: [MatButton, LocationCard, ItemTotals, IconElement, DeleteButtonElement],
  templateUrl: './view-home.html',
  styleUrl: './view-home.scss',
})
export class ViewHome {
  private readonly entityStore = inject(EntityStore);

  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);
  private readonly environmentService = inject(EnvironmentService);

  protected homeId = signal<number | null>(null);
  protected homeName = computed(() => this.homeInfo()?.details?.homeName);
  protected readonly locationInfo: Signal<LocationData[]> = computed(() =>
    Object.values(this.entityStore.locations()),
  );
  protected totalDevices = computed(() => {
    let numDevices = 0;
    this.locationInfo().forEach((location) => {
      if (location.summary && location.summary.numDevices) {
        numDevices += location.summary.numDevices;
      }
    });

    return numDevices;
  });

  protected homeInfo = computed(() => {
    const homeId = this.homeId();

    if (!homeId) {
      return null;
    } else {
      return this.entityStore.homes()[homeId];
    }
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('homeId'));

    if (isNaN(id)) {
      // If the value provided for the homeId is not a number, route the user to the
      // homescreen. No home data can be received if a valid home ID is not provided.
      const viewHomeInvalidHomeIDErrorActions: IModalActions = {
        primaryAction: () => this.viewHomescreen(),
      };
      this.modalService.showModalElement(
        INVALID_HOME_ID_ERROR_MODAL,
        viewHomeInvalidHomeIDErrorActions,
      );
      this.homeId.set(null);
    } else {
      this.homeId.set(id);
      this.setSuccessEffects();
      this.setErrorEffects();
      this.setupSignalStore();
      this.beginGetInfoPolling();
    }
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: EntityActions = this.entityStore.successNotification();

      if (success === 'delete-home') {
        this.viewHomescreen(); // Route the user to the homescreen component.
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: EntityActions | undefined = this.entityStore.errorNotification()?.errorAction;

      if (error === 'get-view-home-info') {
        this.viewHomescreen();
      }
    });
  }

  private setupSignalStore(): void {
    this.entityStore.setPageMode('VIEW');
    this.entityStore.clearEntityState();
  }

  private beginGetInfoPolling(): void {
    const homeId = this.homeId();
    if (homeId) {
      this.entityStore.getViewHomeInfo(
        timer(0, this.environmentService.getEntityInfoPollingRefreshInterval()).pipe(
          map(() => homeId),
          takeUntilDestroyed(),
        ),
      );
    }
  }

  protected viewEditHomePage(): void {
    const homeId = this.homeId();
    if (homeId !== null) {
      this.routerService.viewEditHomePage(homeId);
    }
  }

  protected viewRegisterLocationPage(): void {
    const homeId = this.homeId();
    if (homeId !== null) {
      this.routerService.viewRegisterLocationPage(homeId);
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  protected deleteHomeConfirmation = (): void => {
    const homeId = this.homeId();
    if (homeId) {
      const deleteHomeConfirmationActions: IModalActions = {
        primaryAction: () => this.entityStore.deleteHome(homeId),
      };

      this.modalService.showModalElement(
        DELETE_HOME_CONFIRMATION_MODAL,
        deleteHomeConfirmationActions,
      );
    }
  };
}
