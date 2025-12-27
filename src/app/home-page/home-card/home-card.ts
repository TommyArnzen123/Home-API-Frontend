import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Router } from '@angular/router';
import { VIEW_HOME } from '../../constants/navigation-constants';
import { DeleteService } from '../../services/delete.service';
import { IDeleteHomeRequest, IDeleteHomeResponse } from '../../model/delete-actions.interface';

@Component({
  selector: 'home-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
})
export class HomeCard {
  @Input({ required: true }) homeId!: number;
  @Input({ required: true }) homeName!: string;

  @Output() homeDeleted = new EventEmitter<IDeleteHomeResponse>();


  constructor(private readonly router: Router, private readonly deleteService: DeleteService) {}

  viewHome(): void {
    this.router.navigate([VIEW_HOME, this.homeId]);
  }

  deleteHome(): void {
    if (this.homeId) {

      const deleteHomeRequest: IDeleteHomeRequest = {
        homeId: this.homeId,
      };

      this.deleteService.deleteHomeById(deleteHomeRequest).subscribe({
        next: (response: IDeleteHomeResponse) => {
          this.homeDeleted.emit(response);
        },
        error: () => {
          console.log('There was an error.');
        }
      });
    } else {
      console.log('The home ID is not set.');
    }
  }
}
