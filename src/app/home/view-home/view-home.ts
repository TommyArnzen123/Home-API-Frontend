import { Component, inject, OnInit, effect, signal, computed, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ModalService } from '../../services/modal';
import { BreadcrumbService } from '../../services/breadcrumb';
import { RouterService } from '../../services/router';
import { ItemTotals } from '../../item-totals/item-totals';
import { LocationCard } from './location-card/location-card';
import { IModalActions } from '../../model/modal';
import { INVALID_HOME_ID_ERROR_MODAL } from '../../constants/error-constants';
import { DELETE_HOME_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';
import { EntityActions, EntityStore, LocationData } from '../../store/entity.store';

@Component({
  selector: 'view-home',
  imports: [MatButton, MatIcon, LocationCard, ItemTotals],
  templateUrl: './view-home.html',
  styleUrl: './view-home.scss',
})
export class ViewHome implements OnInit {
  private readonly entityStore = inject(EntityStore);

  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected homeId = signal<number | null>(null);
  protected homeName = computed(() => this.homeInfo()?.details?.homeName);
  protected readonly locationInfo: Signal<LocationData[]> = computed(() =>
    Object.values(this.entityStore.locations()),
  );
  protected totalDevices: number = 0;

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
      this.breadcrumbService.updateHomeId(this.homeId());
      this.breadcrumbService.updatePageInFocus('view-home');

      this.setSuccessEffects();
      this.setErrorEffects();
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
      const error: EntityActions = this.entityStore.errorNotification();

      if (error === 'get-view-home-info') {
        this.viewHomescreen();
      }
    });
  }

  ngOnInit(): void {
    const homeId = this.homeId();
    if (homeId) {
      this.entityStore.setSelectedEntity({ type: 'HOME', id: homeId });
      this.entityStore.getViewHomeInfo(homeId);
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

  protected deleteHomeConfirmation(): void {
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
  }
}
