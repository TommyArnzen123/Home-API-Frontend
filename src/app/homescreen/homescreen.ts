import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from '../services/breadcrumb';
import { RouterService } from '../services/router';
import { HomeCard } from './home-card/home-card';
import { ItemTotals } from '../item-totals/item-totals';
import { IHome } from '../model/get-info';
import { HomescreenActions, HomescreenStore } from './homescreen.store';
import { formatName, setHomescreenGreetingMessage } from '../shared/utility/utility';
import { ModalService } from '../services/modal';
import { DELETE_HOME_SUCCESS_MODAL } from '../constants/delete-constants';
import { DELETE_HOME_ERROR_MODAL } from '../constants/error-constants';

@Component({
  selector: 'homescreen',
  imports: [MatButton, HomeCard, ItemTotals],
  templateUrl: './homescreen.html',
  styleUrl: './homescreen.scss',
})
export class Homescreen implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly homescreenStore = inject(HomescreenStore);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  protected greetingMessage: string = '';
  protected homeInfo: IHome[] | null = null;

  protected totalHomes = 0;
  protected totalLocations = 0;
  protected totalDevices = 0;

  constructor() {
    this.breadcrumbService.updatePageInFocus('homescreen');
    this.setSuccessEffects();
    this.setErrorEffects();
    this.setGeneralEffects();
  }

  private setGeneralEffects(): void {
    effect(() => {
      this.homeInfo = this.homescreenStore.homeInfo();
      this.totalHomes = this.homescreenStore.totalHomes();
      this.totalLocations = this.homescreenStore.totalLocations();
      this.totalDevices = this.homescreenStore.totalDevices();
    });

    effect(() => {
      const userFirstName = this.homescreenStore.userFirstName();
      this.greetingMessage = setHomescreenGreetingMessage(formatName(userFirstName));
    });
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: HomescreenActions = this.homescreenStore.successNotification();

      if (success === 'delete-home') {
        this.modalService.showModalElement(DELETE_HOME_SUCCESS_MODAL);
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: HomescreenActions = this.homescreenStore.errorNotification();

      if (error === 'get-view-homescreen-info') {
        this.routerService.viewCaptiveErrorScreen({ homescreenInfoError: true });
      }

      if (error === 'delete-home') {
        this.modalService.showModalElement(DELETE_HOME_ERROR_MODAL);
      }
    });
  }

  ngOnInit(): void {
    this.homescreenStore.getHomescreenInfo(); // Get info to display on the homescreen.
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected viewRegisterHomePage(): void {
    this.routerService.viewRegisterHomePage();
  }
}
