import { Component, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetInfoService } from '../../services/get-info.service';
import { DeleteService } from '../../services/delete.service';
import { ModalService } from '../../services/modal.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButton } from '@angular/material/button';
import { IModal, IModalActions } from '../../model/modal.interface';
import { IDevice, ILocation, IViewLocationInfoRequest } from '../../model/get-info.interface';
import { Tile } from '../../home-page/home-page';
import { LoginService } from '../../services/login.service';
import { IUser } from '../../model/login.interface';
import { ItemTotals } from '../../item-totals/item-totals';
import { DeviceCard } from './device-card/device-card';

@Component({
  selector: 'view-location',
  imports: [MatGridListModule, MatButton, ItemTotals, DeviceCard],
  templateUrl: './view-location.html',
  styleUrl: './view-location.scss',
})
export class ViewLocation {
  locationId: string | null = null;
  locationName: string | null = null;
  devices: IDevice[] = [];
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
    this.locationId = this.route.snapshot.paramMap.get('locationId');
  }

  ngOnInit(): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();

    if (this.isIUser(user())) {

      if (this.locationId) {
        const getViewLocationInfoRequest: IViewLocationInfoRequest = {
          locationId: this.locationId,
          jwtToken: user()!.jwtToken,
        };

        // Get the location info.
        this.getInfoService.getViewLocationInfo(getViewLocationInfoRequest).subscribe({
          next: (response: ILocation) => {
            console.log(response);
            this.locationName = response.locationName;
            this.devices = response.devices;
            this.totalDevices = response.devices.length;
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

  registerDevice() {
      // this.router.navigate([REGISTER_LOCATION_ROUTE, this.homeId]);
      console.log("Register new device action.");
    }

  deleteLocationVerification() {
    console.log("Delete location verification.");
  }
}
