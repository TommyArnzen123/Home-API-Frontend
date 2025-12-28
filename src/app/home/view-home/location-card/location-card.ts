import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteService } from '../../../services/delete.service';
import { VIEW_LOCATION } from '../../../constants/navigation-constants';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'location-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions],
  templateUrl: './location-card.html',
  styleUrl: './location-card.scss'
})
export class LocationCard {

  @Input({ required: true }) locationId!: number;
  @Input({ required: true }) locationName!: string;

  // @Output() homeDeleted = new EventEmitter<IDeleteHomeResponse>();


  constructor(private readonly router: Router, private readonly deleteService: DeleteService) {}

  viewLocation(): void {
    this.router.navigate([VIEW_LOCATION, this.locationId]);
  }

  deleteLocation(): void {
    console.log('Delete Location Button Clicked.');
  }

  // deleteLocation(): void {
  //   if (this.locationid) {

  //     const deleteHomeRequest: IDeleteHomeRequest = {
  //       homeId: this.homeId,
  //     };

  //     this.deleteService.deleteHomeById(deleteHomeRequest).subscribe({
  //       next: (response: IDeleteHomeResponse) => {
  //         this.homeDeleted.emit(response);
  //       },
  //       error: () => {
  //         console.log('There was an error.');
  //       }
  //     });
  //   } else {
  //     console.log('The home ID is not set.');
  //   }
  // }

}
