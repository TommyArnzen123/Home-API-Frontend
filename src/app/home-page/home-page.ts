import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs';
import { ILoginResponse } from '../model/login.interface';
import { GetInfoService } from '../services/get-info.service';
import { IHomeScreenInfoRequest, IHomeScreenInfoResponse } from '../model/home-screen.interface';
import { MatGridListModule } from '@angular/material/grid-list';
import { ItemTotals } from './item-totals/item-totals';
import { HomeCard } from './home-card/home-card';
import { IHome } from '../model/get-info.interface';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'home-page',
  imports: [ItemTotals, MatGridListModule, HomeCard],
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

  tiles: Tile[] = [
    { text: 'One', cols: 3, rows: 2, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 4, color: 'lightgreen' },
    { text: 'Three', cols: 3, rows: 8, color: 'lightpink' },
  ];

  constructor(
    private readonly loginService: LoginService,
    private readonly getInfoService: GetInfoService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.loginService.getUserLoginInfo().subscribe({
        next: (userInfo: ILoginResponse) => {
          this.userFirstName = this.formatName(userInfo.firstName);

          // Get the current hour and set the greeting message.
          const currentDate = new Date();
          const currentHour = currentDate.getHours();
          this.greetingMessage = this.setGreetingMessage(currentHour);

          const getHomeScreenInfoRequest: IHomeScreenInfoRequest = {
            userId: userInfo.userId,
            jwtToken: userInfo.jwtToken,
          };

          // Get the home screen info.
          this.getInfoService.getHomeScreenInfo(getHomeScreenInfoRequest).subscribe({
            next: (response: IHomeScreenInfoResponse) => {
              this.totalHomes = response.homes.length;
              this.totalLocations = response.numLocations;
              this.totalDevices = response.numDevices;
              this.homeInfo = response.homes;
            },
            error: () => {
              // If there is an error getting the information on the home screen, log the user out.
              // They will not be able to use the application without the information returned from the
              // get home screen info endpoint.
              this.loginService.logout();
            },
          });
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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
}
