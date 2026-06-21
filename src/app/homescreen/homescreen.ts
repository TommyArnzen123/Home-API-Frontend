import { Component, inject, OnInit, effect, computed, Signal, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterService } from '../services/router';
import { HomeCard } from './home-card/home-card';
import { ItemTotals } from '../item-totals/item-totals';
import { formatName, setHomescreenGreetingMessage } from '../shared/utility/utility';
import { EntityActions, EntityStore, ErrorState, HomeData } from '../store/entity.store';
import { BannerElement } from '../shared/components/banner/banner-element';
import { IBanner, IBannerActions } from '../model/banner';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmEmailModal } from './confirm-email-modal/confirm-email-modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'homescreen',
  imports: [MatButton, HomeCard, ItemTotals, BannerElement],
  templateUrl: './homescreen.html',
  styleUrl: './homescreen.scss',
})
export class Homescreen implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly entityStore = inject(EntityStore);
  private readonly routerService = inject(RouterService);
  private readonly modal = inject(MatDialog);

  protected greetingMessage: string = '';

  protected readonly emailConfirmed = computed(() => this.entityStore.emailConfirmed().isConfirmed);

  protected readonly confirmEmailBanner: IBanner = {
    message:
      'Please confirm your email address. Click the button to the right to receive a confirmation email.',
    type: 'WARNING',
    tertiaryText: 'Confirm Email',
  };

  protected readonly confirmEmailBannerActions: IBannerActions = {
    tertiaryAction: () => this.entityStore.generateEmailConfirmationCode(),
  };

  protected readonly homeInfo: Signal<HomeData[]> = computed(() =>
    Object.values(this.entityStore.homes()),
  );
  protected readonly totalHomes: Signal<number> = computed(() => this.homeInfo().length);
  protected totalLocations: Signal<number> = computed(() =>
    this.homeInfo().reduce((sum, home) => {
      if (home.summary) return sum + home.summary.totalLocations;
      else return 0;
    }, 0),
  );
  protected totalDevices: Signal<number> = computed(() =>
    this.homeInfo().reduce((sum, home) => {
      if (home.summary) {
        return sum + home.summary.totalDevices;
      } else return 0;
    }, 0),
  );

  constructor() {
    this.setGeneralEffects();
    this.setSuccessEffects();
    this.setErrorEffects();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private setGeneralEffects(): void {
    effect(() => {
      const userFirstName = this.entityStore.userFirstName();
      this.greetingMessage = setHomescreenGreetingMessage(formatName(userFirstName));
    });
  }

  private setSuccessEffects(): void {
    effect(() => {
      const success: EntityActions = this.entityStore.successNotification();

      if (success === 'generate-email-confirmation-code') {
        this.displayEmailConfirmationModal();
      }
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: ErrorState | null = this.entityStore.errorNotification();

      if (error && error?.errorAction === 'get-view-homescreen-info') {
        this.routerService.viewCaptiveErrorScreen({ homescreenInfoError: true });
      }
    });
  }

  ngOnInit(): void {
    this.entityStore.setPageMode('VIEW');
    this.entityStore.getHomescreenInfo();
  }

  protected viewRegisterHomePage(): void {
    this.routerService.viewRegisterHomePage();
  }

  private displayEmailConfirmationModal(): void {
    this.modal.open(ConfirmEmailModal, {
      width: '400px',
      disableClose: true, // Do not allow background or close button click to close modal.
    });
  }
}
