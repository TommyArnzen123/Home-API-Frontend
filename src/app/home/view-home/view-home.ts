import { Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILocation, IViewHomeInfoRequest, IViewHomeInfoResponse } from '../../model/get-info.interface';
import { GetInfoService } from '../../services/get-info.service';
import { IUser } from '../../model/login.interface';
import { LoginService } from '../../services/login.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { Tile } from '../../home-page/home-page';
import { ItemTotals } from '../../item-totals/item-totals';
import { LocationCard } from './location-card/location-card';
import { REGISTER_LOCATION_ROUTE } from '../../constants/navigation-constants';

@Component({
  selector: 'view-home',
  imports: [MatGridListModule, ItemTotals, LocationCard],
  templateUrl: './view-home.html',
  styleUrl: './view-home.scss',
})
export class ViewHome implements OnInit {
  homeId: string | null = null;
  homeName: string | null = null;
  locations: ILocation[] = [];
  totalDevices: number = 0;

  tiles: Tile[] = [
      { text: 'One', cols: 3, rows: 2, color: 'lightblue' },
      { text: 'Two', cols: 1, rows: 4, color: 'lightgreen' },
      { text: 'Three', cols: 3, rows: 8, color: 'lightpink' },
    ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly loginService: LoginService,
    private readonly getInfoService: GetInfoService,
  ) {
    this.homeId = this.route.snapshot.paramMap.get('homeId');
  }

  ngOnInit(): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();

    if (this.isIUser(user())) {

      if (this.homeId) {
        const getViewHomeInfoRequest: IViewHomeInfoRequest = {
          homeId: this.homeId,
          jwtToken: user()!.jwtToken,
        };

        // Get the home screen info.
        this.getInfoService.getViewHomeInfo(getViewHomeInfoRequest).subscribe({
          next: (response: IViewHomeInfoResponse) => {
            this.homeName = response.homeName;
            this.locations = response.locations;
            this.totalDevices = response.numDevices;
          },
          error: () => {
            // If there is an error getting the information on the home screen, log the user out.
            // They will not be able to use the application without the information returned from the
            // get home screen info endpoint.
            this.loginService.logout();
          },
        });
      }
    } else {
      this.loginService.logout();
    }
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

  registerLocation() {
      this.router.navigate([REGISTER_LOCATION_ROUTE, this.homeId]);
    }
}
