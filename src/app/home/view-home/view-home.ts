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
import {
  ILocation,
  IEntityInfoRequest,
  IViewHomeInfoResponse,
} from '../../model/get-info.interface';
import { IUser } from '../../model/login.interface';
import {
  IDeleteEntityRequest,
  IDeleteHomeResponse,
  IDeleteLocationResponse,
} from '../../model/delete-actions.interface';
import { IModal, IModalActions } from '../../model/modal.interface';
import { HOME_PAGE_ROUTE, REGISTER_LOCATION_ROUTE } from '../../constants/navigation-constants';
import { DELETE_HOME_SUCCESS_MESSAGE } from '../../constants/delete-constants';
import { DELETE_HOME_ERROR_MODAL } from '../../constants/error-constants';
import { RouterService } from '../../services/router.service';

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
  private readonly routerService = inject(RouterService);
  private readonly loginService = inject(LoginService);
  private readonly getInfoService = inject(GetInfoService);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  constructor() {
    const homeId = Number(this.route.snapshot.paramMap.get('homeId'));
    if (isNaN(homeId)) {
      // If the value provided for the homeId is not a number, route the user to the
      // home screen. No home data can be received if an ID is not provided.
      const viewHomeInvalidHomeIDErrorModal: IModal = {
        title: 'Something Went Wrong...',
        content: 'The home ID provided was invalid.',
        disableClose: true,
      };
      const viewHomeInvalidHomeIDErrorActions: IModalActions = {
        primaryAction: () => this.viewHomePage(),
      };
      this.modalService.showModalElement(
        viewHomeInvalidHomeIDErrorModal,
        viewHomeInvalidHomeIDErrorActions,
      );
    } else {
      this.homeId = homeId;
      this.breadcrumbService.updateHomeId(this.homeId);
      this.breadcrumbService.updatePageInFocus('view-home');
    }
  }

  ngOnInit(): void {
    const user: Signal<IUser | null> = this.loginService.getUserLoginInfo();

    if (this.isIUser(user())) {
      if (this.homeId) {
        const getViewHomeInfoRequest: IEntityInfoRequest = {
          id: this.homeId,
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
              // If there is an error getting information for the view home page, display an error
              // message modal and route the user back to the home screen route.
              const viewHomeGetInfoErrorModal: IModal = {
                title: 'Something Went Wrong...',
                content: 'There was an error viewing the selected home.',
                disableClose: true,
              };
              const viewHomeGetInfoErrorActions: IModalActions = {
                primaryAction: () => this.viewHomePage(),
              };
              this.modalService.showModalElement(
                viewHomeGetInfoErrorModal,
                viewHomeGetInfoErrorActions,
              );
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

  viewRegisterLocationPage() {
    const id = this.homeId;
    if (id !== null) {
      this.routerService.viewRegisterLocationPage(id);
    }
  }

  viewHomePage() {
    this.routerService.viewHomePage();
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
      const deleteHomeRequest: IDeleteEntityRequest = {
        id: this.homeId,
      };

      this.subscriptions.push(
        this.deleteService.deleteHomeById(deleteHomeRequest).subscribe({
          next: (response: IDeleteHomeResponse) => {
            this.modalService.showModalElement(DELETE_HOME_SUCCESS_MESSAGE);

            this.viewHomePage();
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
