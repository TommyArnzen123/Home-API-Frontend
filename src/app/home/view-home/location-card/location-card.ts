import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteService } from '../../../services/delete.service';
import { VIEW_LOCATION } from '../../../constants/navigation-constants';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { IDeleteLocationRequest, IDeleteLocationResponse } from '../../../model/delete-actions.interface';
import { ModalService } from '../../../services/modal.service';
import { DELETE_LOCATION_SUCCESS_MESSAGE } from '../../../constants/delete-constants';
import { DELETE_LOCATION_ERROR_MODAL } from '../../../constants/error-constants';

@Component({
  selector: 'location-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions],
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
