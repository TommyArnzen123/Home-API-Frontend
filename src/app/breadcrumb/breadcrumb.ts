import { Component, inject, OnInit, Signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BreadcrumbService } from '../services/breadcrumb.service';
import {
  ABOUT_ROUTE,
  HOME_PAGE_ROUTE,
  SETTINGS_ROUTE,
  VIEW_HOME_ROUTE,
  VIEW_LOCATION_ROUTE,
} from '../constants/navigation-constants';
import { IUser } from '../model/login.interface';
import { LoginService } from '../services/login.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'breadcrumb',
  imports: [],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb implements OnInit {
  private subscriptions: Subscription[] = [];

  private readonly router = inject(Router);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly loginService = inject(LoginService);
  user: Signal<IUser | null> = this.loginService.getUserLoginInfo();

  protected showBreadcrumbComponent = true;

  ngOnInit(): void {
    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        if (route.url === '/' + SETTINGS_ROUTE || route.url === '/' + ABOUT_ROUTE) {
          this.showBreadcrumbComponent = false;
        } else {
          this.showBreadcrumbComponent = true;
        }
      }
    });
  }

  protected isIUser(value: IUser | null): value is IUser {
    return (
      value !== null &&
      typeof value.firstName === 'string' &&
      typeof value.username === 'string' &&
      typeof value.username === 'string' &&
      typeof value.jwtToken === 'string'
    );
  }

  homeId: Signal<number | null> = this.breadcrumbService.getHomeId();
  locationId: Signal<number | null> = this.breadcrumbService.getLocationId();
  deviceId: Signal<number | null> = this.breadcrumbService.getDeviceId();

  viewHomePage(): void {
    this.router.navigate([HOME_PAGE_ROUTE]);
  }

  viewHomeById(): void {
    this.router.navigate([VIEW_HOME_ROUTE, this.homeId()]);
  }

  viewLocationById(): void {
    this.router.navigate([VIEW_LOCATION_ROUTE, this.locationId()]);
  }
}
