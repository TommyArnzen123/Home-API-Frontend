import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Router } from '@angular/router';
import { VIEW_HOME } from '../../constants/navigation-constants';
import { DeleteService } from '../../services/delete.service';
import { IDeleteHomeRequest, IDeleteHomeResponse } from '../../model/delete-actions.interface';
import { ModalService } from '../../services/modal.service';
import { DELETE_HOME_ERROR_MODAL } from '../../constants/error-constants';
import { DELETE_HOME_SUCCESS_MESSAGE } from '../../constants/delete-constants';
import { MatButton } from '@angular/material/button';
import { IModal, IModalActions } from '../../model/modal.interface';

@Component({
  selector: 'home-card',
  imports: [MatCard, MatButton, MatCardHeader, MatCardTitle, MatCardActions],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
})
export class HomeCard {
  @Input({ required: true }) homeId!: number;
  @Input({ required: true }) homeName!: string;

  @Output() homeDeleted = new EventEmitter<IDeleteHomeResponse>();


  constructor(
    private readonly router: Router,
    private readonly deleteService: DeleteService,
    private readonly modalService: ModalService
  ) {}

  viewHome(): void {
    this.router.navigate([VIEW_HOME, this.homeId]);
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

  deleteHome(): void {
    if (this.homeId) {

      const deleteHomeRequest: IDeleteHomeRequest = {
        homeId: this.homeId,
      };

      this.deleteService.deleteHomeById(deleteHomeRequest).subscribe({
        next: (response: IDeleteHomeResponse) => {

          // Emit home deletion response to the home-page component to
          // update the entity displays.
          this.homeDeleted.emit(response);
          this.modalService.showModalElement(DELETE_HOME_SUCCESS_MESSAGE);
        },
        error: () => {
          this.modalService.showModalElement(DELETE_HOME_ERROR_MODAL);
        }
      });
    } else {
      this.modalService.showModalElement(DELETE_HOME_ERROR_MODAL);
    }
  }
}
