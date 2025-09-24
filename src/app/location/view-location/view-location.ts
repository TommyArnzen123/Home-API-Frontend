import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetInfoService } from '../../services/get-info.service';
import { DeleteService } from '../../services/delete.service';
import { ModalService } from '../../services/modal.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButton } from '@angular/material/button';
import { IModal, IModalActions } from '../../model/modal.interface';

@Component({
  selector: 'view-location',
  imports: [MatGridListModule, MatButton],
  templateUrl: './view-location.html',
  styleUrl: './view-location.scss',
})
export class ViewLocation {
  locationId: string | null = null;
  // deviceInformation!: IDeviceInformationCurrentDay;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly getInfoService: GetInfoService,
    private readonly deleteService: DeleteService,
    private readonly modalService: ModalService,
  ) {
    this.locationId = this.route.snapshot.paramMap.get('locationId');
  }

  ngOnInit(): void {
    if (this.locationId) {
      // Run network call to get information for the selected location.
    } else {
      // Display an error message that the deviceId is not available, so the network call to get the information for the device cannot be run.
    }
  }

  deleteLocationVerification(): void {
    const deleteVerificationModal: IModal = {
      title: 'Confirmation',
      content: 'Are you sure you want to delete the location?',
      primaryText: 'Delete',
      secondaryText: 'Cancel',
    };

    const deleteVerificationActions: IModalActions = {
      primaryAction: () => this.deleteLocationButtonAction(),
      secondaryAction: () => this.modalService.closeModalElement(),
    };

    this.modalService.showModalElement(deleteVerificationModal, deleteVerificationActions);
  }

  deleteLocationButtonAction() {
    if (this.locationId) {
      console.log('Delete location action execute.');
      // this.deleteService.deleteDeviceById(this.deviceId).subscribe({
      //   next: (result) => {
      //     console.log(result);
      //     // Route the user to the 'View Location' screen for the location the device was associated with.
      //   },
      //   error: () => {
      //     this.modalService.showModalElement(DELETE_DEVICE_BY_ID_ERROR);
      //   },
      // });
    }
  }
}
