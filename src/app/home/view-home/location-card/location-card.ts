import { Component, EventEmitter, inject, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { DeleteService } from '../../../services/delete.service';
import { ModalService } from '../../../services/modal.service';
import { VIEW_LOCATION } from '../../../constants/navigation-constants';
import { DELETE_LOCATION_SUCCESS_MESSAGE } from '../../../constants/delete-constants';
import { DELETE_LOCATION_ERROR_MODAL } from '../../../constants/error-constants';
import {
  IDeleteLocationRequest,
  IDeleteLocationResponse,
} from '../../../model/delete-actions.interface';
import { IModal, IModalActions } from '../../../model/modal.interface';
import { ILocation } from '../../../model/get-info.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'location-card',
  imports: [MatCard, MatButton, MatIcon, MatCardHeader, MatCardTitle, MatCardActions, DecimalPipe],
  templateUrl: './location-card.html',
  styleUrl: './location-card.scss',
})
export class LocationCard implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  @Input({ required: true }) locationInfo!: ILocation;

  @Output() locationDeleted = new EventEmitter<IDeleteLocationResponse>();

  private readonly router = inject(Router);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);

  protected averageTemperature: number | null = null;

  ngOnInit() {
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

  viewLocation(): void {
    this.router.navigate([VIEW_LOCATION, this.locationInfo.locationId]);
  }

  deleteLocationVerification(): void {
    const deleteVerificationModal: IModal = {
      title: 'Confirmation',
      content: 'Are you sure you want to delete the location?',
      primaryText: 'Delete',
      secondaryText: 'Cancel',
    };

    const deleteVerificationActions: IModalActions = {
      primaryAction: () => this.deleteLocation(),
      secondaryAction: () => this.modalService.closeModalElement(),
    };

    this.modalService.showModalElement(deleteVerificationModal, deleteVerificationActions);
  }

  deleteLocation() {
    if (this.locationInfo && this.locationInfo.locationId) {
      const deleteLocationRequest: IDeleteLocationRequest = {
        locationId: this.locationInfo.locationId,
      };

      this.subscriptions.push(
        this.deleteService.deleteLocationById(deleteLocationRequest).subscribe({
          next: (response: IDeleteLocationResponse) => {
            this.modalService.showModalElement(DELETE_LOCATION_SUCCESS_MESSAGE);
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
