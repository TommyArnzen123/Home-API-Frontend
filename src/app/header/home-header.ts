import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { LoginService } from '../services/login.service';
import { BreadcrumbService } from '../services/breadcrumb.service';
import { Router } from '@angular/router';
import {
  ABOUT_ROUTE,
  HOME_PAGE_ROUTE,
  LOGIN_ROUTE,
  SETTINGS_ROUTE,
} from '../constants/navigation-constants';

@Component({
  selector: 'home-header',
  imports: [MatButton],
  templateUrl: './home-header.html',
  styleUrl: './home-header.scss',
})
export class HomeHeader {
  private readonly loginService = inject(LoginService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly router = inject(Router);

  isLoggedIn = this.loginService.isLoggedIn;

  viewHomePage() {
    // Route to the home page.
    this.router.navigateByUrl(HOME_PAGE_ROUTE);
  }

  viewSettingsPage() {
    // Route to the settings page.
    this.router.navigateByUrl(SETTINGS_ROUTE);
  }

  viewAboutPage() {
    // Route to the about page.
    this.router.navigateByUrl(ABOUT_ROUTE);
  }

  viewLoginScreen() {
    // Route to the login page.
    this.router.navigateByUrl(LOGIN_ROUTE);
  }

  logout() {
    this.loginService.logout();
    this.breadcrumbService.clearService();
  }
}
