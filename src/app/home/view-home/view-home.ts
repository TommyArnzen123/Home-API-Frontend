import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { GetInfoService } from '../../services/get-info.service';
import { LoginService } from '../../services/login.service';
import { DeleteService } from '../../services/delete.service';
import { ModalService } from '../../services/modal.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { ItemTotals } from '../../item-totals/item-totals';
import { LocationCard } from './location-card/location-card';
import { Tile } from '../../home-page/home-page';
import { HOME_PAGE_ROUTE, REGISTER_LOCATION_ROUTE } from '../../constants/navigation-constants';
import { DELETE_HOME_SUCCESS_MESSAGE } from '../../constants/delete-constants';
import { DELETE_HOME_ERROR_MODAL } from '../../constants/error-constants';
import {
  ILocation,
  IViewHomeInfoRequest,
  IViewHomeInfoResponse,
} from '../../model/get-info.interface';
import { IUser } from '../../model/login.interface';
import {
  IDeleteHomeRequest,
  IDeleteHomeResponse,
  IDeleteLocationResponse,
} from '../../model/delete-actions.interface';
import { IModal, IModalActions } from '../../model/modal.interface';

@Component({
  selector: 'view-home',
  imports: [MatButton, MatIcon, ItemTotals, LocationCard],
  templateUrl: './view-home.html',
  styleUrl: './view-home.scss',
})
export class ViewHome implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  homeId: number | null = null;
  homeName: string | null = null;
  locations: ILocation[] = [];
  totalDevices: number = 0;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);
  private readonly getInfoService = inject(GetInfoService);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  constructor() {
    this.homeId = Number(this.route.snapshot.paramMap.get('homeId'));
    this.breadcrumbService.updateHomeId(this.homeId);
    this.breadcrumbService.updatePageInFocus('view-home');
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
        this.subscriptions.push(
          this.getInfoService.getViewHomeInfo(getViewHomeInfoRequest).subscribe({
            next: (response: IViewHomeInfoResponse) => {
              this.homeName = response.homeName;
              this.locations = response.locations;

              response.locations.forEach((location) => {
                this.totalDevices += location.devices.length;
              });
            },
            error: () => {
              // If there is an error getting the information on the home screen, log the user out.
              // They will not be able to use the application without the information returned from the
              // get home screen info endpoint.
              this.loginService.logout();
            },
          }),
        );
      }
    } else {
      this.loginService.logout();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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

  returnToHomeScreen() {
    // Route to the home screen page.
    this.router.navigate([HOME_PAGE_ROUTE]);
  }

  deleteHomeVerification(): void {
    const deleteVerificationModal: IModal = {
      title: 'Confirmation',
      content: 'Are you sure you want to delete the home?',
      primaryText: 'Delete',
      secondaryText: 'Cancel',
    };

    const deleteVerificationActions: IModalActions = {
      primaryAction: () => this.deleteHome(),
      secondaryAction: () => this.modalService.closeModalElement(),
    };

    this.modalService.showModalElement(deleteVerificationModal, deleteVerificationActions);
  }

  deleteHome() {
    if (this.homeId) {
      const deleteHomeRequest: IDeleteHomeRequest = {
        homeId: this.homeId,
      };

      this.subscriptions.push(
        this.deleteService.deleteHomeById(deleteHomeRequest).subscribe({
          next: (response: IDeleteHomeResponse) => {
            this.modalService.showModalElement(DELETE_HOME_SUCCESS_MESSAGE);

            this.returnToHomeScreen();
          },
          error: () => {
            this.modalService.showModalElement(DELETE_HOME_ERROR_MODAL);
          },
        }),
      );
    } else {
      this.modalService.showModalElement(DELETE_HOME_ERROR_MODAL);
    }
  }

  locationDeletedAction(deleteLocationResponse: IDeleteLocationResponse) {
    this.totalDevices = this.totalDevices - deleteLocationResponse.numDevices;

    // Remove the deleted location from the registered locations list.
    this.locations = this.locations.filter(
      (location) => location.locationId !== deleteLocationResponse.locationId,
    );
  }
}
