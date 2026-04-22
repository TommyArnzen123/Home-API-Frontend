import { Component, EventEmitter, inject, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { DeleteService } from '../../../services/delete';
import { ModalService } from '../../../services/modal';
import { RouterService } from '../../../services/router';
import { IDeleteEntityRequest, IDeleteLocationResponse } from '../../../model/delete-actions';
import { IModalActions } from '../../../model/modal';
import { ILocation } from '../../../model/get-info';
import { DELETE_LOCATION_SUCCESS_MODAL } from '../../../constants/delete-constants';
import { DELETE_LOCATION_ERROR_MODAL } from '../../../constants/error-constants';
import { DELETE_LOCATION_CONFIRMATION_MODAL } from '../../../constants/dialog-confirmation-constants';

@Component({
  selector: 'location-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions, MatButton, MatIcon, DecimalPipe],
  templateUrl: './location-card.html',
  styleUrl: './location-card.scss',
})
export class LocationCard implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly routerService = inject(RouterService);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);

  protected averageTemperature: number | null = null;

  @Input({ required: true }) locationInfo!: ILocation;
  @Output() locationDeleted = new EventEmitter<IDeleteLocationResponse>();

  ngOnInit(): void {
    let counter = 0;
    let temperature: number | null = 0;

    this.locationInfo.devices.forEach((device) => {
      if (device.temperature) {
        counter++;
        temperature = temperature
          ? temperature + device.temperature.temperature
          : device.temperature.temperature;
      }
    });

    if (counter > 0) {
      this.averageTemperature = temperature / counter;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected viewLocationById(): void {
    this.routerService.viewLocationById(this.locationInfo.locationId);
  }

  protected deleteLocationConfirmation(): void {
    const deleteLocationConfirmationActions: IModalActions = {
      primaryAction: () => this.deleteLocation(),
    };

    this.modalService.showModalElement(
      DELETE_LOCATION_CONFIRMATION_MODAL,
      deleteLocationConfirmationActions,
    );
  }

  private deleteLocation(): void {
    if (this.locationInfo && this.locationInfo.locationId) {
      const deleteLocationRequest: IDeleteEntityRequest = {
        id: this.locationInfo.locationId,
      };

      this.subscriptions.push(
        this.deleteService.deleteLocationById(deleteLocationRequest).subscribe({
          next: (response: IDeleteLocationResponse) => {
            this.modalService.showModalElement(DELETE_LOCATION_SUCCESS_MODAL);
            this.locationDeleted.emit(response);
          },
          error: () => {
            this.modalService.showModalElement(DELETE_LOCATION_ERROR_MODAL);
          },
        }),
      );
    } else {
      this.modalService.showModalElement(DELETE_LOCATION_ERROR_MODAL);
    }
  }
}
