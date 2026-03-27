import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login';
import { BreadcrumbService } from '../services/breadcrumb';
import { RouterService } from '../services/router';
import { LOGIN_ROUTE } from '../constants/navigation-constants';

@Component({
  selector: 'header',
  imports: [MatButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly loginService = inject(LoginService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly router = inject(Router);
  private readonly routerService = inject(RouterService);

  protected showLoginOption = false;

  protected isLoggedIn = this.loginService.isLoggedIn;

  ngOnInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe((route) => {
        if (route instanceof NavigationEnd) {
          if (route.url === '/' + LOGIN_ROUTE) {
            this.showLoginOption = false;
          } else {
            this.showLoginOption = true;
          }
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  viewHomePage() {
    this.routerService.viewHomePage();
  }

  viewSettingsPage() {
    this.routerService.viewSettingsPage();
  }

  viewAboutPage() {
    this.routerService.viewAboutPage();
  }

  viewLoginPage() {
    this.routerService.viewLoginPage();
  }

  logout() {
    this.loginService.logout();
    this.breadcrumbService.clearService();
  }
}
