import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login.service';
import { GetInfoService } from '../services/get-info.service';
import { BreadcrumbService } from '../services/breadcrumb.service';
import { HomeCard } from './home-card/home-card';
import { ItemTotals } from '../item-totals/item-totals';
import { CAPTIVE_ERROR_ROUTE, REGISTER_HOME_ROUTE } from '../constants/navigation-constants';
import { IUser } from '../model/login.interface';
import {
  IHome,
  IHomeScreenInfoRequest,
  IHomeScreenInfoResponse,
} from '../model/get-info.interface';
import { IDeleteHomeResponse } from '../model/delete-actions.interface';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'home-page',
  imports: [ItemTotals, HomeCard, MatButton],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  greetingMessage!: string;
  userFirstName!: string;
  homeInfo: IHome[] = [];

  totalHomes = 0;
  totalLocations = 0;
  totalDevices = 0;

  private readonly loginService = inject(LoginService);
  private readonly getInfoService = inject(GetInfoService);
  private readonly router = inject(Router);
  private readonly breadcrumbService = inject(BreadcrumbService);

  constructor() {
    this.breadcrumbService.clearService();
  }

  private isIUser(value: IUser | null): value is IUser {
    return (
      value !== null &&
      typeof value.firstName === 'string' &&
      typeof value.username === 'string' &&
      typeof value.username === 'string' &&
      typeof value.jwtToken === 'string'
    );
  }

  ngOnInit(): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();

    if (this.isIUser(user())) {
      this.userFirstName = this.formatName(user()!.firstName);

      // Get the current hour and set the greeting message.
      const currentDate = new Date();
      const currentHour = currentDate.getHours();
      this.greetingMessage = this.setGreetingMessage(currentHour);

      const getHomeScreenInfoRequest: IHomeScreenInfoRequest = {
        userId: user()!.userId,
        jwtToken: user()!.jwtToken,
      };

      // Get the home screen info.
      this.subscriptions.push(
        this.getInfoService.getHomeScreenInfo(getHomeScreenInfoRequest).subscribe({
          next: (response: IHomeScreenInfoResponse) => {
            this.homeInfo = response.homes;
            this.setHomeInfo(response);
          },
          error: () => {
            // If there is an error getting the home screen info, route the user
            // to the captive error screen.
            this.router.navigate([CAPTIVE_ERROR_ROUTE], {
              queryParams: {
                homeScreenInfoError: true,
              },
            });
          },
        }),
      );
    } else {
      this.loginService.logout();
    }
  }

  setHomeInfo(homeInfo: IHomeScreenInfoResponse): void {
    this.totalHomes = homeInfo.homes.length;
    homeInfo.homes.forEach((home) => {
      this.totalLocations += home.totalLocations;
      this.totalDevices += home.totalDevices;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  registerHome() {
    this.router.navigateByUrl(REGISTER_HOME_ROUTE);
  }

  formatName(name: string): string {
    let formattedName = name.toLowerCase();
    formattedName = name.charAt(0).toUpperCase() + name.substring(1);
    return formattedName;
  }

  setGreetingMessage(currentHour: number): string {
    if (currentHour >= 0 && currentHour <= 11) {
      return 'Good Morning ' + this.userFirstName + '!';
    } else if (currentHour >= 12 && currentHour <= 16) {
      return 'Good Afternoon ' + this.userFirstName + '!';
    } else {
      return 'Good Evening ' + this.userFirstName + '!';
    }
  }

  homeDeletedAction(deleteHomeResponse: IDeleteHomeResponse) {
    // Remove one home from the registered homes count.
    this.totalHomes = this.totalHomes - 1;

    // Remove the deleted locations from the registered locations count.
    this.totalLocations = this.totalLocations - deleteHomeResponse.numLocations;

    // Remove the deleted devices from the registered devices count.
    this.totalDevices = this.totalDevices - deleteHomeResponse.numDevices;

    // Remove the deleted home from the registered homes list.
    this.homeInfo = this.homeInfo.filter((home) => home.homeId !== deleteHomeResponse.homeId);
  }
}
