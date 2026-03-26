import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ABOUT_ROUTE,
  CAPTIVE_ERROR_ROUTE,
  HOME_PAGE_ROUTE,
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
import { ICaptiveError } from '../model/captive-error.interface';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private router = inject(Router);

  // Route to the login page.
  viewLoginPage() {
    this.router.navigate([LOGIN_ROUTE]);
  }

  // Route to the register user page.
  viewRegisterUserPage() {
    this.router.navigate([REGISTER_USER_ROUTE]);
  }

  // Route to the register home page.
  viewRegisterHomePage() {
    this.router.navigate([REGISTER_HOME_ROUTE]);
  }

  // Route to the register location page.
  viewRegisterLocationPage(homeId: number) {
    this.router.navigate([REGISTER_LOCATION_ROUTE, homeId]);
  }

  // Route to the register device page.
  viewRegisterDevicePage(locationId: number) {
    this.router.navigate([REGISTER_DEVICE_ROUTE, locationId]);
  }

  // Route to the about page.
  viewAboutPage() {
    this.router.navigate([ABOUT_ROUTE]);
  }

  // Route to the settings page.
  viewSettingsPage() {
    this.router.navigate([SETTINGS_ROUTE]);
  }

  // Route to the homepage.
  viewHomePage() {
    this.router.navigate([HOME_PAGE_ROUTE]);
  }

  // Route to the 'view home' page.
  viewHomeById(homeId: number) {
    this.router.navigate([VIEW_HOME_ROUTE, homeId]);
  }

  // Route to the 'view location' page.
  viewLocationById(locationId: number) {
    this.router.navigate([VIEW_LOCATION_ROUTE, locationId]);
  }

  // Route to the 'view device' page.
  viewDeviceById(deviceId: number) {
    this.router.navigate([VIEW_DEVICE_ROUTE, deviceId]);
  }

  // Route to the captive error page.
  viewCaptiveErrorScreen(params: ICaptiveError) {
    // Set the params that have been defined.
    const queryParams = {
      ...(params.homeScreenInfoError && { homeScreenInfoError: true }),
      ...(params.sessionTimeoutError && { sessionTimeoutError: true }),
    };

    this.router.navigate([CAPTIVE_ERROR_ROUTE], { queryParams });
  }
}
