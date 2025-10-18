import { Component, inject, Signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoadingService } from '../services/loading.service';
import { LoadingInterface } from '../model/loading.interface';

@Component({
  selector: 'home-loading-component',
  imports: [MatProgressSpinner],
  templateUrl: './loading-component.html',
  styleUrl: './loading-component.scss',
})
export class LoadingComponent {
  loadingService = inject(LoadingService);

  loading: Signal<LoadingInterface> = this.loadingService.loading;
}
