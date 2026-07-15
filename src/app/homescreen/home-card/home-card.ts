import { Component, inject, Input, Output } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { ModalService } from '../../services/modal';
import { RouterService } from '../../services/router';
import { IModalActions } from '../../model/modal';
import { DELETE_HOME_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';
import { EntityStore, HomeData } from '../../store/entity.store';
import { IconElement } from '../../shared/components/icon-element/icon-element';
import { DeleteButtonElement } from '../../shared/components/button-element/delete-button-element';

@Component({
  selector: 'home-card',
  imports: [
    MatButton,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardActions,
    IconElement,
    DeleteButtonElement,
  ],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
})
export class HomeCard {
  private readonly entityStore = inject(EntityStore);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  @Input({ required: true }) homeInfo!: HomeData;

  protected viewHomeById(): void {
    if (this.homeInfo && this.homeInfo.entityId) {
      this.routerService.viewHomeById(this.homeInfo.entityId);
    }
  }

  protected deleteHomeConfirmation = (): void => {
    const deleteHomeConfirmationActions: IModalActions = {
      primaryAction: () => this.entityStore.deleteHome(this.homeInfo.entityId),
    };

    this.modalService.showModalElement(
      DELETE_HOME_CONFIRMATION_MODAL,
      deleteHomeConfirmationActions,
    );
  };
}
