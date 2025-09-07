import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILocation } from '../../model/get-info.interface';
import { GetInfoService } from '../../services/get-info.service';

@Component({
  selector: 'view-home',
  imports: [],
  templateUrl: './view-home.html',
  styleUrl: './view-home.scss',
})
export class ViewHome implements OnInit {
  homeId: string | null = null;
  locations: ILocation[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly getInfoService: GetInfoService,
  ) {
    this.homeId = this.route.snapshot.paramMap.get('homeId');
    console.log(this.homeId);
  }

  ngOnInit(): void {
    if (this.homeId) {
      this.getInfoService.getLocationsByHomeId(this.homeId).subscribe((response: ILocation[]) => {
        this.locations = response;
        console.log(this.locations);
      });
    } else {
      // Display an error message that the homeId is not available, so the network call to get the locations for the home cannot be run.
    }
  }
}
