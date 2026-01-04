import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteService } from '../../../services/delete.service';
import { VIEW_DEVICE } from '../../../constants/navigation-constants';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'device-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions],
  templateUrl: './device-card.html',
  styleUrl: './device-card.scss'
})
export class DeviceCard {
  @Input({ required: true }) deviceId!: number;
  @Input({ required: true }) deviceName!: string;


  constructor(private readonly router: Router, private readonly deleteService: DeleteService) {}

  viewDevice(): void {
    this.router.navigate([VIEW_DEVICE, this.deviceId]);
  }

  deleteDevice(): void {
    console.log('Delete Device Button Clicked.');
  }
}
