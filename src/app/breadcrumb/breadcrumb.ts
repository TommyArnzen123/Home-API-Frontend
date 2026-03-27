import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbService, PageInFocus } from '../services/breadcrumb';
import { LoginService } from '../services/login';
import { RouterService } from '../services/router';
import { IUser } from '../model/login';
import { ABOUT_ROUTE, SETTINGS_ROUTE } from '../constants/navigation-constants';

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
  private readonly routerService = inject(RouterService);

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
    this.routerService.viewHomePage();
  }

  viewHomeById(): void {
    const id = this.homeId();
    if (id !== null) {
      this.routerService.viewHomeById(id);
    }
  }

  viewLocationById(): void {
    const id = this.locationId();
    if (id !== null) {
      this.routerService.viewLocationById(id);
    }
  }
}
