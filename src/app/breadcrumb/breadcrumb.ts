import { Component, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../services/breadcrumb.service';
import { HOME_PAGE_ROUTE, VIEW_HOME, VIEW_LOCATION } from '../constants/navigation-constants';
import { IUser } from '../model/login.interface';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'breadcrumb',
  imports: [],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  private readonly router = inject(Router);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly loginService = inject(LoginService);
  user: Signal<IUser | null> = this.loginService.getUserLoginInfo();

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
    this.router.navigate([VIEW_HOME, this.homeId()]);
  }

  viewLocationById(): void {
    this.router.navigate([VIEW_LOCATION, this.locationId()]);
  }
}
