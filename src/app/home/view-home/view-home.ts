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
import { DELETE_HOME_SUCCESS_MODAL } from '../../constants/delete-constants';
import {
  VIEW_HOME_INVALID_HOME_ID_ERROR_MODAL,
  DELETE_HOME_ERROR_MODAL,
  VIEW_HOME_GET_INFO_ERROR_MODAL,
} from '../../constants/error-constants';
import { DELETE_HOME_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';

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
    const id = Number(this.route.snapshot.paramMap.get('homeId'));

    if (isNaN(id)) {
      // If the value provided for the homeId is not a number, route the user to the
      // homescreen. No home data can be received if a valid home ID is not provided.
      const viewHomeInvalidHomeIDErrorActions: IModalActions = {
        primaryAction: () => this.viewHomescreen(),
      };
      this.modalService.showModalElement(
        VIEW_HOME_INVALID_HOME_ID_ERROR_MODAL,
        viewHomeInvalidHomeIDErrorActions,
      );
    } else {
      this.homeId = id;
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

        // Get the homescreen info.
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
              // message modal and route the user back to the homescreen route.
              const viewHomeGetInfoErrorActions: IModalActions = {
                primaryAction: () => this.viewHomescreen(),
              };
              this.modalService.showModalElement(
                VIEW_HOME_GET_INFO_ERROR_MODAL,
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
    if (this.homeId !== null) {
      this.routerService.viewRegisterLocationPage(this.homeId);
    }
  }

  private viewHomescreen(): void {
    this.routerService.viewHomescreen();
  }

  protected deleteHomeConfirmation(): void {
    const deleteHomeConfirmationActions: IModalActions = {
      primaryAction: () => this.deleteHome(),
    };

    this.modalService.showModalElement(
      DELETE_HOME_CONFIRMATION_MODAL,
      deleteHomeConfirmationActions,
    );
  }

  private deleteHome(): void {
    if (this.homeId) {
      const deleteHomeRequest: IDeleteEntityRequest = {
        id: this.homeId,
      };

      this.subscriptions.push(
        this.deleteService.deleteHomeById(deleteHomeRequest).subscribe({
          next: (response: IDeleteHomeResponse) => {
            this.modalService.showModalElement(DELETE_HOME_SUCCESS_MODAL);

            this.viewHomescreen();
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
