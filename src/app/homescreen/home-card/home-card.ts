import { Component, EventEmitter, inject, Input, Output, OnDestroy } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { DeleteService } from '../../services/delete';
import { ModalService } from '../../services/modal';
import { RouterService } from '../../services/router';
import { IDeleteEntityRequest, IDeleteHomeResponse } from '../../model/delete-actions';
import { IModalActions } from '../../model/modal';
import { IHome } from '../../model/get-info';
import { DELETE_HOME_ERROR_MODAL } from '../../constants/error-constants';
import { DELETE_HOME_SUCCESS_MODAL } from '../../constants/delete-constants';
import { DELETE_HOME_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';

@Component({
  selector: 'home-card',
  imports: [MatButton, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardActions],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
})
export class HomeCard implements OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly routerService = inject(RouterService);
  private readonly deleteService = inject(DeleteService);
  private readonly modalService = inject(ModalService);

  @Input({ required: true }) homeInfo!: IHome;
  @Output() homeDeleted = new EventEmitter<IDeleteHomeResponse>();

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected viewHomeById(): void {
    this.routerService.viewHomeById(this.homeInfo.homeId);
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
    if (this.homeInfo && this.homeInfo.homeId) {
      const deleteHomeRequest: IDeleteEntityRequest = {
        id: this.homeInfo.homeId,
      };

      this.subscriptions.push(
        this.deleteService.deleteHomeById(deleteHomeRequest).subscribe({
          next: (response: IDeleteHomeResponse) => {
            // Emit home deletion response to the homescreen component to
            // update the entity displays.
            this.homeDeleted.emit(response);
            this.modalService.showModalElement(DELETE_HOME_SUCCESS_MODAL);
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
