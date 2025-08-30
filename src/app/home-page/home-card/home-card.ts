import { Component, Input } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'home-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
})
export class HomeCard {
  @Input({ required: true }) homeId!: number;
  @Input({ required: true }) homeName!: string;

  viewHome(): void {
    console.log('View Home button clicked. - ' + this.homeId);
  }

  deleteHome(): void {
    console.log('Delete Home button clicked. - ' + this.homeId);
  }
}
