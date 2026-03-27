import { Component, inject, Signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoadingService } from '../services/loading.service';
import { LoadingInterface } from '../model/loading';

@Component({
  selector: 'home-loading-component',
  imports: [MatProgressSpinner],
  templateUrl: './loading-indicator.html',
  styleUrl: './loading-indicator.scss',
})
export class LoadingComponent {
  private loadingService = inject(LoadingService);

  protected loading: Signal<LoadingInterface> = this.loadingService.loading;
}
