import { Component, inject, Signal } from '@angular/core';
import { BreadcrumbService } from '../services/breadcrumb.service';
import { Router } from '@angular/router';
import { HOME_PAGE_ROUTE, VIEW_HOME, VIEW_LOCATION } from '../constants/navigation-constants';

@Component({
  selector: 'breadcrumb',
  imports: [],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly router = inject(Router);
  homeId: Signal<number | null> = this.breadcrumbService.getHomeId();
  locationId: Signal<number | null> = this.breadcrumbService.getLocationId();
  deviceId: Signal<number | null> = this.breadcrumbService.getDeviceId();

  viewHomeScreen(): void {
    this.router.navigate([HOME_PAGE_ROUTE]);
  }

  viewHomeById(): void {
    this.router.navigate([VIEW_HOME, this.homeId()]);
  }

  viewLocationById(): void {
    this.router.navigate([VIEW_LOCATION, this.locationId()]);
  }
}
