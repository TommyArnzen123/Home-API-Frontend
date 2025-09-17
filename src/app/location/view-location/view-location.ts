import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetInfoService } from '../../services/get-info.service';
import { DeleteService } from '../../services/delete.service';
import { ModalService } from '../../services/modal.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButton } from '@angular/material/button';

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
      // this.getInfoService.getViewDeviceInformation(this.deviceId).subscribe({
      //   next: (response: IDeviceInformationCurrentDay) => {
      //     this.deviceInformation = response;
      //     this.currentTemperatureDate = new Date(response.mostRecentTemperatureAvailableDateTime);
      //     this.insertAverageTemperatureByHourInformation(
      //       // this.deviceInformation.averageTemperaturesByHourCurrentDay,
      //       averageTempInfoMock, // Comment this line out for live data.
      //     );
      //   },
      //   error: () => {
      //     this.modalService.showModalElement(GET_DEVICE_INFORMATION_BY_DEVICE_ID);
      //   },
      // });
    } else {
      // Display an error message that the deviceId is not available, so the network call to get the information for the device cannot be run.
    }
  }

  deleteLocationButtonAction(): void {
    console.log('Delete button clicked.');
  }
}
