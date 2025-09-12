import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IModal, IModalActions } from '../model/modal.interface';
import { ModalElement } from '../shared/modal-element/modal-element';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private readonly modal: MatDialog) {}

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
