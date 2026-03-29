import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { IModal, IModalActions } from '../../../model/modal';

@Component({
  selector: 'modal-element',
  imports: [MatButton, MatDialogTitle, MatDialogContent, MatDialogActions],
  templateUrl: './modal-element.html',
  styleUrl: './modal-element.scss',
})
export class ModalElement {
  protected title: string;
  protected content: string;
  protected footer: string;
  protected primaryText: string;
  protected secondaryText: string | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { modalContent: IModal; actions?: IModalActions },
    private readonly modal: MatDialogRef<ModalElement>,
  ) {
    this.title = this.data.modalContent.title;
    this.content = this.data.modalContent.content;
    this.footer = this.data.modalContent.footer ? this.data.modalContent.footer : '';
    this.primaryText = this.data.modalContent.primaryText
      ? this.data.modalContent.primaryText
      : 'Ok';
    this.secondaryText = this.data.modalContent.secondaryText
      ? this.data.modalContent.secondaryText
      : null;
  }

  protected primaryButtonAction(): void {
    if (this.data.actions?.primaryAction) {
      this.data.actions.primaryAction(); // Execute the primary action if set.
    }

    this.closeModal();
  }

  protected secondaryButtonAction(): void {
    if (this.data.actions?.secondaryAction) {
      this.data.actions.secondaryAction(); // Execute the secondary action if set.
    }

    this.closeModal();
  }

  private closeModal(): void {
    this.modal.close();
  }
}
