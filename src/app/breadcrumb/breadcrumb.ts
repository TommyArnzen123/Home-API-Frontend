import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbService, PageInFocus } from '../services/breadcrumb.service';
import { LoginService } from '../services/login.service';
import { IUser } from '../model/login.interface';
import {
  ABOUT_ROUTE,
  SETTINGS_ROUTE,
  HOME_PAGE_ROUTE,
  VIEW_HOME_ROUTE,
  VIEW_LOCATION_ROUTE,
} from '../constants/navigation-constants';

@Component({
  selector: 'breadcrumb',
  imports: [],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly router = inject(Router);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly loginService = inject(LoginService);

  protected user: Signal<IUser | null> = this.loginService.getUserLoginInfo();
  protected homeId: Signal<number | null> = this.breadcrumbService.getHomeId();
  protected locationId: Signal<number | null> = this.breadcrumbService.getLocationId();
  protected deviceId: Signal<number | null> = this.breadcrumbService.getDeviceId();
  protected pageInFocus: Signal<PageInFocus> = this.breadcrumbService.getPageInFocus();

  protected showBreadcrumbComponent = true;

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

  protected isIUser(value: IUser | null): value is IUser {
    return (
      value !== null &&
      typeof value.userId === 'string' &&
      typeof value.firstName === 'string' &&
      typeof value.username === 'string' &&
      typeof value.jwtToken === 'string'
    );
  }

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
