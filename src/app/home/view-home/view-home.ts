import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal';
import { BreadcrumbService } from '../../services/breadcrumb';
import { RouterService } from '../../services/router';
import { ItemTotals } from '../../item-totals/item-totals';
import { LocationCard } from './location-card/location-card';
import { ILocation } from '../../model/get-info';
import { IModalActions } from '../../model/modal';
import {
  DELETE_HOME_SUCCESS_MODAL,
  DELETE_LOCATION_SUCCESS_MODAL,
} from '../../constants/delete-constants';
import {
  INVALID_HOME_ID_ERROR_MODAL,
  DELETE_HOME_ERROR_MODAL,
  VIEW_HOME_GET_INFO_ERROR_MODAL,
} from '../../constants/error-constants';
import { DELETE_HOME_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';
import { ViewHomeActions, ViewHomeStore } from './view-home.store';

@Component({
  selector: 'view-home',
  imports: [MatButton, MatIcon, LocationCard, ItemTotals],
  templateUrl: './view-home.html',
  styleUrl: './view-home.scss',
})
export class ViewHome implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly viewHomeStore = inject(ViewHomeStore);

  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected homeId: number | null = null;
  protected homeName: string | null = null;
  protected locations: ILocation[] = [];
  protected totalDevices: number = 0;

  constructor() {
    this.setSuccessEffects();
    this.setErrorEffects();
    this.setGeneralEffects();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('homeId'));

    if (isNaN(id)) {
      this.displayInvalidHomeIdError();
    } else {
      this.breadcrumbService.updateHomeId(id);
      this.breadcrumbService.updatePageInFocus('view-home');
    }

    this.viewHomeStore.reset();
    this.viewHomeStore.getHomeInfo(id); // Get home info.
  }

  private displayInvalidHomeIdError(): void {
    // If the value provided for the homeId is not a number, route the user to the
    // homescreen. No home data can be received if a valid home ID is not provided.
    const viewHomeInvalidHomeIDErrorActions: IModalActions = {
      primaryAction: () => this.viewHomescreen(),
    };
    this.modalService.showModalElement(
      INVALID_HOME_ID_ERROR_MODAL,
      viewHomeInvalidHomeIDErrorActions,
    );
  }

  private setGeneralEffects(): void {
    // Get the home info as it is updated over time.
    effect(() => {
      this.homeId = this.viewHomeStore.homeId();
      this.homeName = this.viewHomeStore.homeName();
      this.locations = this.viewHomeStore.locations();
      this.totalDevices = this.viewHomeStore.totalDevices();
    });
  }

  private setSuccessEffects(): void {
    const modalActions: IModalActions = {
      primaryAction: () => this.viewHomeStore.resetNotificationState(),
    };

    effect(() => {
      const success: ViewHomeActions = this.viewHomeStore.successNotification();

      if (success === 'delete-home') {
        this.modalService.showModalElement(DELETE_HOME_SUCCESS_MODAL, modalActions);
        this.viewHomescreen();
      }

      if (success === 'delete-location') {
        this.modalService.showModalElement(DELETE_LOCATION_SUCCESS_MODAL, modalActions);
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: ViewHomeActions = this.viewHomeStore.errorNotification();

      if (error === 'get-view-home-info') {
        const viewHomeGetInfoErrorActions: IModalActions = {
          primaryAction: () => this.viewHomescreen(),
        };
        this.modalService.showModalElement(
          VIEW_HOME_GET_INFO_ERROR_MODAL,
          viewHomeGetInfoErrorActions,
        );
      }

      if (error === 'delete-home') {
        this.modalService.showModalElement(DELETE_HOME_ERROR_MODAL);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected viewRegisterLocationPage(): void {
    if (this.homeId !== null) {
      this.routerService.viewRegisterLocationPage(this.homeId);
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  protected deleteHomeConfirmation(): void {
    const deleteHomeConfirmationActions: IModalActions = {
      primaryAction: () => this.viewHomeStore.deleteHome(),
    };

    this.modalService.showModalElement(
      DELETE_HOME_CONFIRMATION_MODAL,
      deleteHomeConfirmationActions,
    );
  }
}
