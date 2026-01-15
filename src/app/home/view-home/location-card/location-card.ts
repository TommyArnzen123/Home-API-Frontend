import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteService } from '../../../services/delete.service';
import { VIEW_LOCATION } from '../../../constants/navigation-constants';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { IDeleteLocationRequest, IDeleteLocationResponse } from '../../../model/delete-actions.interface';
import { ModalService } from '../../../services/modal.service';
import { DELETE_LOCATION_SUCCESS_MESSAGE } from '../../../constants/delete-constants';
import { DELETE_LOCATION_ERROR_MODAL } from '../../../constants/error-constants';
import { MatButton } from '@angular/material/button';
import { IModal, IModalActions } from '../../../model/modal.interface';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'location-card',
  imports: [MatCard, MatButton, MatIcon, MatCardHeader, MatCardTitle, MatCardActions],
  templateUrl: './location-card.html',
  styleUrl: './location-card.scss'
})
export class LocationCard {

  @Input({ required: true }) locationId!: number;
  @Input({ required: true }) locationName!: string;

  @Output() locationDeleted = new EventEmitter<IDeleteLocationResponse>();

  constructor(private readonly router: Router,
    private readonly deleteService: DeleteService,
    private readonly modalService: ModalService
  ) {}

  viewLocation(): void {
    this.router.navigate([VIEW_LOCATION, this.locationId]);
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
    if (this.locationId) {
      const deleteLocationRequest: IDeleteLocationRequest = {
        locationId: this.locationId,
      };
        
      this.deleteService.deleteLocationById(deleteLocationRequest).subscribe({
        next: (response: IDeleteLocationResponse) => {
          this.modalService.showModalElement(DELETE_LOCATION_SUCCESS_MESSAGE);
          this.locationDeleted.emit(response);
        },
        error: () => {
          this.modalService.showModalElement(DELETE_LOCATION_ERROR_MODAL);
        }
      });
    } else {
      this.modalService.showModalElement(DELETE_LOCATION_ERROR_MODAL);
    }
  }
}
