import { Component, Input } from '@angular/core';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Router } from '@angular/router';
import { VIEW_HOME } from '../../constants/navigation-constants';

@Component({
  selector: 'home-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
})
export class HomeCard {
  @Input({ required: true }) homeId!: number;
  @Input({ required: true }) homeName!: string;

  constructor(private readonly router: Router) {}

  viewHome(): void {
    this.router.navigate([VIEW_HOME, this.homeId]);
  }

  deleteHome(): void {
    console.log('Delete Home button clicked. - ' + this.homeId);
  }
}
