import { Component, inject, Input, Output } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ModalService } from '../../services/modal';
import { RouterService } from '../../services/router';
import { IModalActions } from '../../model/modal';
import { DELETE_HOME_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';
import { EntityStore, HomeData } from '../../store/entity.store';

@Component({
  selector: 'home-card',
  imports: [MatButton, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardActions],
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

  protected deleteHomeConfirmation(): void {
    const deleteHomeConfirmationActions: IModalActions = {
      primaryAction: () => this.entityStore.deleteHome(this.homeInfo.entityId),
    };

    this.modalService.showModalElement(
      DELETE_HOME_CONFIRMATION_MODAL,
      deleteHomeConfirmationActions,
    );
  }
}
