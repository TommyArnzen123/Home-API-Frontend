import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetInfoService } from '../../services/get-info.service';
import { IDeviceInformationCurrentDay } from '../../model/get-info.interface';
import { MatGridListModule } from '@angular/material/grid-list';
import { DisplayTempByHour } from './display-temp-by-hour/display-temp-by-hour';

@Component({
  selector: 'view-device',
  imports: [DisplayTempByHour, MatGridListModule],
  templateUrl: './view-device.html',
  styleUrl: './view-device.scss',
})
export class ViewDevice implements OnInit {
  deviceId: string | null = null;
  deviceInformation!: IDeviceInformationCurrentDay;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly getInfoService: GetInfoService,
  ) {
    this.deviceId = this.route.snapshot.paramMap.get('deviceId');
  }

  ngOnInit(): void {
    if (this.deviceId) {
      this.getInfoService
        .getViewDeviceInformation(this.deviceId)
        .subscribe((response: IDeviceInformationCurrentDay) => {
          this.deviceInformation = response;
        });
    } else {
      // Display an error message that the deviceId is not available, so the network call to get the information for the device cannot be run.
    }
  }

  deleteDeviceButtonAction(): void {
    console.log('Delete device button clicked. - ' + this.deviceId);
  }
}
