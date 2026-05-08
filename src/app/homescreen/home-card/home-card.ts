import { Component, inject, Input, OnDestroy } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal';
import { RouterService } from '../../services/router';
import { IModalActions } from '../../model/modal';
import { IHome } from '../../model/get-info';
import { DELETE_HOME_CONFIRMATION_MODAL } from '../../constants/dialog-confirmation-constants';
import { HomescreenStore } from '../homescreen.store';

@Component({
  selector: 'home-card',
  imports: [MatButton, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardActions],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
})
export class HomeCard implements OnDestroy {
  private subscriptions: Subscription[] = [];

  private readonly homescreenStore = inject(HomescreenStore);
  private readonly routerService = inject(RouterService);
  private readonly modalService = inject(ModalService);

  @Input({ required: true }) homeInfo!: IHome;

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected viewHomeById(): void {
    if (this.homeInfo && this.homeInfo.homeId) {
      this.routerService.viewHomeById(this.homeInfo.homeId);
    }
  }

  protected deleteHomeConfirmation(): void {
    const deleteHomeConfirmationActions: IModalActions = {
      primaryAction: () => this.homescreenStore.deleteHome(this.homeInfo.homeId),
    };

    this.modalService.showModalElement(
      DELETE_HOME_CONFIRMATION_MODAL,
      deleteHomeConfirmationActions,
    );
  }
}
