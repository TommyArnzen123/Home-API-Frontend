import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalElement } from '../shared/components/modal-element/modal-element';
import { IModal, IModalActions } from '../model/modal.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly modal = inject(MatDialog);

  showModalElement(modalContent: IModal, actions?: IModalActions) {
    this.modal.open(ModalElement, {
      width: '500px',
      position: {
        top: '200px',
      },
      data: {
        modalContent,
        actions,
      },
    });
  }

  closeModalElement() {
    this.modal.closeAll();
  }
}
