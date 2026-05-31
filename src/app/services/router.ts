import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ABOUT_ROUTE,
  CAPTIVE_ERROR_ROUTE,
  EDIT_HOME_ROUTE,
  EDIT_LOCATION_ROUTE,
  HOMESCREEN_ROUTE,
  LOGIN_ROUTE,
  REGISTER_DEVICE_ROUTE,
  REGISTER_HOME_ROUTE,
  REGISTER_LOCATION_ROUTE,
  REGISTER_USER_ROUTE,
  SETTINGS_ROUTE,
  VIEW_DEVICE_ROUTE,
  VIEW_HOME_ROUTE,
  VIEW_LOCATION_ROUTE,
} from '../constants/navigation-constants';
import { ICaptiveError } from '../model/captive-error';
import { IBreadcrumbItemDisplay } from '../model/breadcrumb';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private readonly router = inject(Router);

  // Route to the login page.
  viewLoginPage(): void {
    this.router.navigate([LOGIN_ROUTE]);
  }

  // Route to the register user page.
  viewRegisterUserPage(): void {
    this.router.navigate([REGISTER_USER_ROUTE]);
  }

  // Route to the register home page.
  viewRegisterHomePage(): void {
    this.router.navigate([REGISTER_HOME_ROUTE]);
  }

  // Route to the register location page.
  viewRegisterLocationPage(homeId: number): void {
    this.router.navigate([REGISTER_LOCATION_ROUTE, homeId]);
  }

  // Route to the register device page.
  viewRegisterDevicePage(locationId: number): void {
    this.router.navigate([REGISTER_DEVICE_ROUTE, locationId]);
  }

  // Route to the edit home page.
  viewEditHomePage(homeId: number): void {
    this.router.navigate([EDIT_HOME_ROUTE, homeId]);
  }

  // Route to the edit location page.
  viewEditLocationPage(locationId: number): void {
    this.router.navigate([EDIT_LOCATION_ROUTE, locationId]);
  }

  // Route to the about page.
  viewAboutPage(): void {
    this.router.navigate([ABOUT_ROUTE]);
  }

  // Route to the settings page.
  viewSettingsPage(): void {
    this.router.navigate([SETTINGS_ROUTE]);
  }

  // Route to the homescreen.
  viewHomescreen(): void {
    this.router.navigate([HOMESCREEN_ROUTE]);
  }

  // Route to the 'view home' page.
  viewHomeById(homeId: number): void {
    this.router.navigate([VIEW_HOME_ROUTE, homeId]);
  }

  // Route to the 'view location' page.
  viewLocationById(locationId: number): void {
    this.router.navigate([VIEW_LOCATION_ROUTE, locationId]);
  }

  // Route to the 'view device' page.
  viewDeviceById(deviceId: number): void {
    this.router.navigate([VIEW_DEVICE_ROUTE, deviceId]);
  }

  // Route to the captive error page.
  viewCaptiveErrorScreen(params: ICaptiveError): void {
    // Set the params that have been defined.
    const queryParams = {
      ...(params.homescreenInfoError && { homescreenInfoError: true }),
      ...(params.sessionTimeoutError && { sessionTimeoutError: true }),
    };

    this.router.navigate([CAPTIVE_ERROR_ROUTE], { queryParams });
  }

  // Route to the right page based on the breadcrumb item selected.
  breadcrumbRoute(selectedItem: IBreadcrumbItemDisplay): void {
    switch (selectedItem.entityType) {
      case 'USER':
        this.viewHomescreen();
        break;
      case 'HOME':
        this.viewHomeById(selectedItem.entityId);
        break;
      case 'LOCATION':
        this.viewLocationById(selectedItem.entityId);
        break;
      case 'DEVICE':
        this.viewDeviceById(selectedItem.entityId);
        break;
    }
  }
}
