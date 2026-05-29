import { Component, inject, OnInit, OnDestroy, computed } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouterService } from '../services/router';
import { ABOUT_ROUTE, SETTINGS_ROUTE } from '../constants/navigation-constants';
import { EntityStore } from '../store/entity.store';

@Component({
  selector: 'breadcrumb',
  imports: [],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly entityStore = inject(EntityStore);
  private readonly router = inject(Router);
  private readonly routerService = inject(RouterService);

  protected showBreadcrumbComponent = true;

  protected homeId = computed(() => {
    const homeEntity = this.entityStore.entityPath().find((entity) => entity.type === 'HOME');
    return homeEntity?.id ?? null;
  });

  protected locationId = computed(() => {
    const locationEntity = this.entityStore
      .entityPath()
      .find((entity) => entity.type === 'LOCATION');
    return locationEntity?.id ?? null;
  });

  protected deviceId = computed(() => {
    const deviceEntity = this.entityStore.entityPath().find((entity) => entity.type === 'DEVICE');
    return deviceEntity?.id ?? null;
  });

  protected selectedEntity = computed(() => {
    const entity = this.entityStore.selectedEntity();
    return entity?.type ?? null;
  });

  protected pageMode = computed(() => {
    return this.entityStore.pageMode();
  });

  // Show or hide the breadcrumb component.
  ngOnInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe((route) => {
        if (route instanceof NavigationEnd) {
          if (route.url === '/' + SETTINGS_ROUTE || route.url === '/' + ABOUT_ROUTE) {
            this.showBreadcrumbComponent = false;
          } else {
            this.showBreadcrumbComponent = true;
          }
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  protected viewHomeById(): void {
    const id = this.homeId();
    if (id !== null) {
      this.routerService.viewHomeById(id);
    } else {
      this.viewHomescreen();
    }
  }

  protected viewLocationById(): void {
    const id = this.locationId();
    if (id !== null) {
      this.routerService.viewLocationById(id);
    } else {
      this.viewHomescreen();
    }
  }
}
