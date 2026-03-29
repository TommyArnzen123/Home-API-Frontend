import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { GetInfoService } from '../../services/get-info';
import { LoginService } from '../../services/login';
import { DeleteService } from '../../services/delete';
import { ModalService } from '../../services/modal';
import { BreadcrumbService } from '../../services/breadcrumb';
import { RouterService } from '../../services/router';
import { ItemTotals } from '../../item-totals/item-totals';
import { LocationCard } from './location-card/location-card';
import { ILocation, IEntityInfoRequest, IViewHomeInfoResponse } from '../../model/get-info';
import { IUser } from '../../model/login';
import {
  IDeleteEntityRequest,
  IDeleteHomeResponse,
  IDeleteLocationResponse,
} from '../../model/delete-actions';
import { IModal, IModalActions } from '../../model/modal';
import { DELETE_HOME_SUCCESS_MESSAGE } from '../../constants/delete-constants';
import { DELETE_HOME_ERROR_MODAL } from '../../constants/error-constants';

@Component({
  selector: 'view-home',
  imports: [MatButton, MatIcon, ItemTotals, LocationCard],
  templateUrl: './view-home.html',
  styleUrl: './view-home.scss',
})
export class ViewHome implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(RouterService);
  private readonly loginService = inject(LoginService);
  private readonly getInfoService = inject(GetInfoService);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  private homeId: number | null = null;
  protected homeName: string | null = null;
  protected locations: ILocation[] = [];
  protected totalDevices: number = 0;

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

  protected viewRegisterLocationPage(): void {
    const id = this.homeId;
    if (id !== null) {
      this.routerService.viewRegisterLocationPage(id);
    }
  }

  private viewHomePage(): void {
    this.routerService.viewHomePage();
  }

  protected deleteHomeVerification(): void {
    const deleteVerificationModal: IModal = {
      title: 'Confirmation',
      content: 'Are you sure you want to delete the home?',
      primaryText: 'Delete',
      secondaryText: 'Cancel',
    };

    const deleteVerificationActions: IModalActions = {
      primaryAction: () => this.deleteHome(),
    };

    this.modalService.showModalElement(deleteVerificationModal, deleteVerificationActions);
  }

  private deleteHome(): void {
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

  protected locationDeletedAction(deleteLocationResponse: IDeleteLocationResponse): void {
    this.totalDevices = this.totalDevices - deleteLocationResponse.numDevices;

    // Remove the deleted location from the registered locations list.
    this.locations = this.locations.filter(
      (location) => location.locationId !== deleteLocationResponse.locationId,
    );
  }

  private isIUser(value: IUser | null): value is IUser {
    return this.loginService.isIUser(value);
  }
}
