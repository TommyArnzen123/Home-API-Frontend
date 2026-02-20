import { Component, EventEmitter, inject, Input, Output, OnDestroy } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { DeleteService } from '../../services/delete.service';
import { ModalService } from '../../services/modal.service';
import { VIEW_HOME_ROUTE } from '../../constants/navigation-constants';
import { DELETE_HOME_ERROR_MODAL } from '../../constants/error-constants';
import { DELETE_HOME_SUCCESS_MESSAGE } from '../../constants/delete-constants';
import { IDeleteHomeRequest, IDeleteHomeResponse } from '../../model/delete-actions.interface';
import { IModal, IModalActions } from '../../model/modal.interface';
import { IHome } from '../../model/get-info.interface';

@Component({
  selector: 'home-card',
  imports: [MatCard, MatButton, MatIcon, MatCardHeader, MatCardTitle, MatCardActions],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
})
export class HomeCard implements OnDestroy {
  subscriptions: Subscription[] = [];

  @Input({ required: true }) homeInfo!: IHome;

  @Output() homeDeleted = new EventEmitter<IDeleteHomeResponse>();

  private readonly router = inject(Router);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  viewHome(): void {
    this.router.navigate([VIEW_HOME_ROUTE, this.homeInfo.homeId]);
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
    if (this.homeInfo && this.homeInfo.homeId) {
      const deleteHomeRequest: IDeleteHomeRequest = {
        homeId: this.homeInfo.homeId,
      };

      this.subscriptions.push(
        this.deleteService.deleteHomeById(deleteHomeRequest).subscribe({
          next: (response: IDeleteHomeResponse) => {
            // Emit home deletion response to the home-page component to
            // update the entity displays.
            this.homeDeleted.emit(response);
            this.modalService.showModalElement(DELETE_HOME_SUCCESS_MESSAGE);
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
}
