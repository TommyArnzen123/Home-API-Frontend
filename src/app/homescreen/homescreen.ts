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
import { IHome, IEntityInfoRequest, IHomeScreenInfoResponse } from '../model/get-info';
import { IDeleteHomeResponse } from '../model/delete-actions';

// TO DO: Rename the file to 'homescreen.ts'.
//        Update required items accordingly.
//        HomePage references should be Homescreen.
@Component({
  selector: 'homescreen',
  imports: [ItemTotals, HomeCard, MatButton],
  templateUrl: './homescreen.html',
  styleUrl: './homescreen.scss',
})
export class Homescreen implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly loginService = inject(LoginService);
  private readonly getInfoService = inject(GetInfoService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly routerService = inject(RouterService);

  protected greetingMessage!: string;
  private userFirstName!: string;
  protected homeInfo: IHome[] = [];

  protected totalHomes = 0;
  protected totalLocations = 0;
  protected totalDevices = 0;

  constructor() {
    this.breadcrumbService.updatePageInFocus('home-page');
  }

  ngOnInit(): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();

    if (this.isIUser(user())) {
      this.userFirstName = this.formatName(user()!.firstName);

      // Get the current hour and set the greeting message.
      const currentDate = new Date();
      const currentHour = currentDate.getHours();
      this.greetingMessage = this.setGreetingMessage(currentHour);

      const getHomeScreenInfoRequest: IEntityInfoRequest = {
        id: user()!.userId,
        jwtToken: user()!.jwtToken,
      };

      // Get the homescreen info.
      this.subscriptions.push(
        this.getInfoService.getHomeScreenInfo(getHomeScreenInfoRequest).subscribe({
          next: (response: IHomeScreenInfoResponse) => {
            this.homeInfo = response.homes;
            this.setHomeInfo(response);
          },
          error: () => {
            // If there is an error getting the homescreen info, route the user
            // to the captive error screen.
            this.routerService.viewCaptiveErrorScreen({ homeScreenInfoError: true });
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

  // TO DO: Rename method -> setEntityTotals
  private setHomeInfo(homeInfo: IHomeScreenInfoResponse): void {
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
    formattedName = name.charAt(0).toUpperCase() + name.substring(1);
    return formattedName;
  }

  private setGreetingMessage(currentHour: number): string {
    if (currentHour >= 0 && currentHour <= 11) {
      return 'Good Morning ' + this.userFirstName + '!';
    } else if (currentHour >= 12 && currentHour <= 16) {
      return 'Good Afternoon ' + this.userFirstName + '!';
    } else {
      return 'Good Evening ' + this.userFirstName + '!';
    }
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
