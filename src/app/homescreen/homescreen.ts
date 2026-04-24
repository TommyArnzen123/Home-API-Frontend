import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login';
import { GetInfoService } from '../services/get-info';
import { BreadcrumbService } from '../services/breadcrumb';
import { RouterService } from '../services/router';
import { HomeCard } from './home-card/home-card';
import { ItemTotals } from '../item-totals/item-totals';
import { IUser } from '../model/login';
import { IHome, IEntityInfoRequest, IHomescreenInfoResponse } from '../model/get-info';
import { IDeleteHomeResponse } from '../model/delete-actions';

@Component({
  selector: 'homescreen',
  imports: [MatButton, HomeCard, ItemTotals],
  templateUrl: './homescreen.html',
  styleUrl: './homescreen.scss',
})
export class Homescreen implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly loginService = inject(LoginService);
  private readonly getInfoService = inject(GetInfoService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly routerService = inject(RouterService);

  protected greetingMessage: string = '';
  private userFirstName: string = '';
  protected homeInfo: IHome[] = [];

  protected totalHomes = 0;
  protected totalLocations = 0;
  protected totalDevices = 0;

  constructor() {
    this.breadcrumbService.updatePageInFocus('homescreen');
  }

  ngOnInit(): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();
    const userId = user()?.userId || undefined;
    const firstName = user()?.firstName || undefined;
    const jwtToken = user()?.jwtToken || undefined;

    if (this.isIUser(user()) && userId && jwtToken) {
      if (firstName) {
        this.userFirstName = this.formatName(firstName);
      }

      this.setGreetingMessage();

      const getHomescreenInfoRequest: IEntityInfoRequest = {
        id: userId,
        jwtToken,
      };

      // Get the homescreen info.
      this.subscriptions.push(
        this.getInfoService.getHomescreenInfo(getHomescreenInfoRequest).subscribe({
          next: (response: IHomescreenInfoResponse) => {
            this.homeInfo = response.homes;
            this.setEntityTotals(response);
          },
          error: () => {
            // If there is an error getting the homescreen info, route the user
            // to the captive error screen.
            this.routerService.viewCaptiveErrorScreen({ homescreenInfoError: true });
          },
        }),
      );
    } else {
      // If the user login info object is not defined, log the user out.
      this.loginService.logout();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private setEntityTotals(homeInfo: IHomescreenInfoResponse): void {
    this.totalHomes = homeInfo.homes.length;
    homeInfo.homes.forEach((home) => {
      this.totalLocations += home.totalLocations;
      this.totalDevices += home.totalDevices;
    });
  }

  protected viewRegisterHomePage(): void {
    this.routerService.viewRegisterHomePage();
  }

  private formatName(name: string): string {
    let formattedName = name.toLowerCase();
    formattedName = formattedName.charAt(0).toUpperCase() + formattedName.substring(1);
    return formattedName;
  }

  private setGreetingMessage(): void {
    // Get the current hour.
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    // Set a default message.
    let message = ('Hello ' + this.userFirstName).trim() + '!';

    if (currentHour >= 0 && currentHour <= 11) {
      message = ('Good Morning ' + this.userFirstName).trim() + '!';
    } else if (currentHour >= 12 && currentHour <= 16) {
      message = ('Good Afternoon ' + this.userFirstName).trim() + '!';
    } else {
      message = ('Good Evening ' + this.userFirstName).trim() + '!';
    }

    this.greetingMessage = message;
  }

  protected homeDeletedAction(deleteHomeResponse: IDeleteHomeResponse): void {
    // Remove one home from the registered homes count.
    this.totalHomes = this.totalHomes - 1;

    // Remove the deleted locations from the registered locations count.
    this.totalLocations = this.totalLocations - deleteHomeResponse.numLocations;

    // Remove the deleted devices from the registered devices count.
    this.totalDevices = this.totalDevices - deleteHomeResponse.numDevices;

    // Remove the deleted home from the registered homes list.
    this.homeInfo = this.homeInfo.filter((home) => home.homeId !== deleteHomeResponse.homeId);
  }

  private isIUser(value: IUser | null): value is IUser {
    return this.loginService.isIUser(value);
  }
}
