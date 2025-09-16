import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { IModal, IModalActions } from '../../../model/modal.interface';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'modal-element',
  imports: [MatButton, MatDialogTitle, MatDialogContent, MatDialogActions],
  templateUrl: './modal-element.html',
  styleUrl: './modal-element.scss',
})
export class ModalElement {
  title: string;
  content: string;
  primaryText: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { modalContent: IModal; actions?: IModalActions },
    private readonly modal: MatDialogRef<ModalElement>,
  ) {
    this.title = this.data.modalContent.title;
    this.content = this.data.modalContent.content;
    this.primaryText = this.data.modalContent.primaryText
      ? this.data.modalContent.primaryText
      : 'Ok';
  }

  primaryButtonAction(): void {
    if (this.data.actions?.primaryAction) {
      this.data.actions.primaryAction(); // Execute the primary action if set.
    }

    this.closeModal();
  }

  closeModal(): void {
    this.modal.close();
  }
}
