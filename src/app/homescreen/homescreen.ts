import { Component, inject, OnInit, effect, computed, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BreadcrumbService } from '../services/breadcrumb';
import { RouterService } from '../services/router';
import { HomeCard } from './home-card/home-card';
import { ItemTotals } from '../item-totals/item-totals';
import { formatName, setHomescreenGreetingMessage } from '../shared/utility/utility';
import { EntityActions, EntityStore, HomeData } from '../store/entity.store';

@Component({
  selector: 'homescreen',
  imports: [MatButton, HomeCard, ItemTotals],
  templateUrl: './homescreen.html',
  styleUrl: './homescreen.scss',
})
export class Homescreen implements OnInit {
  private readonly entityStore = inject(EntityStore);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly routerService = inject(RouterService);

  protected greetingMessage: string = '';

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
    this.breadcrumbService.updatePageInFocus('homescreen');
    this.setGeneralEffects();
    this.setErrorEffects();
  }

  private setGeneralEffects(): void {
    effect(() => {
      const userFirstName = this.entityStore.userFirstName();
      this.greetingMessage = setHomescreenGreetingMessage(formatName(userFirstName));
    });

    effect(() => {
      console.log(this.entityStore.selectedEntity());
      console.log(this.entityStore.entityPath());
    });
  }

  private setErrorEffects(): void {
    effect(() => {
      const error: EntityActions = this.entityStore.errorNotification();

      if (error === 'get-view-homescreen-info') {
        this.routerService.viewCaptiveErrorScreen({ homescreenInfoError: true });
      }
    });
  }

  ngOnInit(): void {
    this.entityStore.setSelectedEntity(null);
    this.entityStore.getHomescreenInfo();
  }

  protected viewRegisterHomePage(): void {
    this.routerService.viewRegisterHomePage();
  }
}
